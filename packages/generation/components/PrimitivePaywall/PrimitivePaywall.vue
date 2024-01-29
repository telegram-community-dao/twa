<template>
  <slide-preset v-bind="props" :button="null">
    <template #before>
      <slot name="before" />
    </template>
    <slot />

    <div :class="[$style.links, $style['links_' + props.shape]]">
      <Link v-for="link in links" v-bind="link" :key="link.text" />
    </div>

    <div :class="$style.loading" v-if="loading">
      <span :class="$style.loader"></span>
    </div>

    <paywall-popup v-model:opened="popupOpened" v-bind="popup" @on-select="onSelectOption"
      @update:opened="onUpdateOpened" />

    <main-button v-if="carousel ? active : !!mainButtonComputedText" haptic="light" :keep-alive="!!carousel"
      :text="mainButtonComputedText" @on-click="onSubmit" />
  </slide-preset>
</template>

<script setup lang="ts">
import { PaywallPopup } from "@tok/generation/components/PaywallPopup";
import { SlidePreset } from "@tok/generation/presets/slide";
import { FORM_STATE_TOKEN } from "@tok/generation/tokens";
import { useCarousel } from "@tok/generation/use/carousel";
import { useI18n } from "@tok/i18n";
import { MainButton } from "@tok/telegram-ui/components/MainButton";
import { useTelegramSdk } from "@tok/telegram-ui/use/sdk";
import { Link } from "@tok/ui/components/Link";
import { useAlerts } from "@tok/ui/use/alerts";
import { useMoney } from "@tok/ui/use/money";
import { computed, inject, onBeforeUnmount, ref, toRefs } from "vue";

import {
  PrimitivePaywallDefaultProps,
  PrimitivePaywallProps,
} from "./PrimitivePaywall.props";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<PrimitivePaywallProps>(),
  PrimitivePaywallDefaultProps
);

const { mainButtonText, popup, selectedProduct, active } = toRefs(props);

const formState = inject(FORM_STATE_TOKEN, null);

const i18n = useI18n();
const sdk = useTelegramSdk();

// to detect if we inside carousel or not, to prevent triggering MainButton.show()
const carousel = useCarousel();
const router = useRouter();
const alertsService = useAlerts({ autoCloseOnUnmount: true });

const buttonText = computed(() => {
  if (selectedProduct.value?.button) {
    const button = selectedProduct.value.button;
    if (typeof button === 'string') {
      return button
    } else {
      return button.content
    }
  } else {
    return mainButtonText.value
  }
})

const translatedMainButton = i18n.useTranslated(buttonText);
const paymentCanceledMessage = i18n.useTranslated(
  "_alerts.payment.canceled",
  "You have canceled the payment selection"
);

const priceFromProduct = computed(() => {
  const value = selectedProduct.value;

  return value ? `${value.price}` : "";
});

const _money = useMoney(priceFromProduct);

const mainButtonComputedText = computed(() => {
  const value = selectedProduct.value;
  const _text = translatedMainButton.value;
  const _price = _money.value;

  if (carousel && active.value === false) {
    return "";
  }

  if (!value || !_text || popupOpened.value) {
    return "";
  }

  return _text.replace(/\{price\}/g, _price.formatted);
});

const popupOpened = ref(false);
const loading = ref(false);

const onSubmit = () => {
  if (selectedProduct.value) {
    const button = selectedProduct.value.button;
    if (button && typeof button === 'object' && button.to) {
      router.push(button.to);
      return;
    }
  }

  popupOpened.value = true;
};

let alertTimeout: ReturnType<typeof setTimeout> | undefined;

const onUpdateOpened = (opened: boolean) => {
  popupOpened.value = opened;
}

const onSelectOption = async (
  id: "cryptomus" | "wallet_pay" | undefined
) => {
  alertsService.closeLast();
  loading.value = true;

  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  if (!id) {
    alertsService.show(paymentCanceledMessage.value, {
      type: "error",
    });

    return;
  }

  const payload = formState ? formState.state.value : {};

  const _product = selectedProduct.value!;

  const dataProduct = {
    payment_method: id,
    id: _product.id,
    currency: _money.value.options.currency,
    price: _money.value.value,
    title: _product.title || "Payment",
    description: _product.description || "Payment description",
  };

  const hooks = {
    'cryptomus': import.meta.env.VITE_CRYPTOMUS_URL,
    'wallet_pay': import.meta.env.VITE_WALLETPAY_URL,
  };

  if (!hooks[id]) {
    alertsService.show(`Hook for ${id} not found`, {
      type: "error",
    });
    throw new Error(`Hook for ${id} not found`);
  }

  const order = await fetch(
    hooks[id] + '/sync',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initDataUnsafe: sdk.initDataUnsafe,
        initData: sdk.initData,
        data: {
          product: dataProduct,
          payload,
          form: formState?.state.value,
        },
      }),
    }
  ).then(r => r);

  window.location.href = "https://t.me/comdaobot"
};

onBeforeUnmount(() => {
  alertTimeout && clearTimeout(alertTimeout);
});
</script>

<style lang="scss" module>
.links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &:not(&_stacked) {
    margin-top: auto;
  }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #5EA5DE88;
  display: flex;
  align-items: center;
  justify-content: center;
}

// spin animation
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite
}

.loader::before,
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 5px solid #FFF;
  animation: prixClipFix 2s linear infinite;
}

.loader::after {
  transform: rotate3d(90, 90, 0, 180deg);
  border-color: #5EA5DE;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(360deg)
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0)
  }

  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0)
  }

  75%,
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%)
  }
}</style>
