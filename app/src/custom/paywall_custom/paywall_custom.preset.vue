<template>
  <primitive-paywall v-bind="props" :selected-product="selectedProduct" :mainButtonText="mainButtonComputedText">
    <template #before>
      <div :class="$style.upper">
        <Image v-bind="bgProps" :class="$style.upperBackground" />

        <div :class="$style.timer">
          <p :class="$style.timerTitle">Private Presale Ends In</p>
          <p :class="$style.timerValue">14d 16h 32s</p>
        </div>
      </div>
    </template>

    <h4 v-html="i18nCta" />
    <div :class="$style.container">
      <input-text type="text" inputmode="numeric" :model-value="qty"
        @update:model-value="onUpdate('qty', $event)" />
    </div>

    <div :class="$style.content">
      <div v-if="product.media" :class="$style.media">
        <media-preset v-bind="product.media" />
      </div>

      <div :class="$style.container">
        <div :class="$style.title">
          <h4 v-html="selectedProduct.title" />

          <money :value="product.price" />
        </div>

        <p v-html="selectedProduct.description" :class="$style.description" />
      </div>
    </div>
  </primitive-paywall>
</template>

<script setup lang="ts">
import Image from "@tok/generation/components/Media/Image.vue";
import { MediaPreset } from '@tok/generation/components/Media';
import { PrimitivePaywall } from '@tok/generation/components/PrimitivePaywall';
import { useI18n } from '@tok/i18n';
import { Money } from '@tok/ui/components/Money';
import { InputText } from "@tok/ui/components/InputText";
import { computed, inject, reactive, ref, toRefs } from 'vue';

import {
  PaywallCustomPresetDefaultProps,
  PaywallCustomPresetProps,
} from "./paywall_custom.preset.props";
import { FORM_STATE_TOKEN } from "@tok/generation/tokens";
import { useMoney } from "@tok/ui/use/money";

const props = withDefaults(
  defineProps<PaywallCustomPresetProps>(),
  PaywallCustomPresetDefaultProps
);

const { product, cta, mainButtonText } = toRefs(props);

const bgProps = {
  type: "image",
  src: import("../../assets/img/deposit_bg.png"),
  alt: "deposit_bg",
  aspectRatio: 780 / 300,
  style: {
    zIndex: 0
  }
} as const;

const i18n = useI18n();

const selectedProduct = computed(() => {
  const value = product.value;

  return {
    ...value,
    title: value.title ? i18n.translate(value.title) : '',
    description: value.description ? i18n.translate(value.description) : '',
  };
});


const i18nCta = i18n.useTranslated(cta);
const formState = inject(FORM_STATE_TOKEN, null);
const generatedForm = reactive<Record<string, unknown>>({});
const qty = ref(0)

const onUpdate = (id: string, value: unknown) => {
  generatedForm[id] = value;
  qty.value = Number(value);
  formState?.update({ [id]: value });
};

const total = computed(() => {
  const price = Number(selectedProduct.value.price)
  return price * qty.value
})

const totalMoney = useMoney(total)

const buttonText = computed(() => {
  const button = selectedProduct.value.button;
  if (typeof button !== 'undefined') {
    if (typeof button === 'string') {
      return button
    } else {
      return button.content
    }
  } else if (typeof mainButtonText?.value !== 'undefined') {
    return mainButtonText.value
  }

  return "FUCK"
})

const translatedMainButton = i18n.useTranslated(buttonText);

console.log({
    totalMoney,
    translatedMainButton
  })

const mainButtonComputedText = computed(() => {
  const totalText = totalMoney?.value.formatted
  return translatedMainButton.value.replace(/\{price\}/g, totalText || "");
})

</script>

<style lang="scss" module>
.content {
  display: flex;

  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: left;

  box-shadow: 0px 0.25rem 1.5rem 0px var(--tok-text-color-08);
}

.container {
  width: 100%;
}

.media {
  color: var(--tok-primary);

  margin-right: 0.75rem;
}

.title {
  display: flex;
  justify-content: space-between;

  padding-top: 0.5rem;
  margin-bottom: 0.25rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--tok-text-color-08);
  font: var(--tok-font-h4);
}

.description {
  font: var(--tok-font-xs);
}


.upper {
  position: relative;
  margin: -1rem -1rem 1rem -1rem;
}

.upperBackground {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.timer {
  position: relative;
  z-index: 1;
  color: white;
  padding: 24px 0 72px 0;

  text-align: center;
}

.timerTitle {
  margin-bottom: 0.5rem;
}

.timerValue {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>

<!-- <template>
  <slide-preset v-bind="props" :button="null">
    <template #before>
      <div :class="$style.upper">
        <Image v-bind="bgProps" :class="$style.upperBackground" />

        <div :class="$style.timer">
          <p :class="$style.timerTitle">Private Presale Ends In</p>
          <p :class="$style.timerValue">14d 16h 32s</p>
        </div>
      </div>
    </template>

    <h4 v-html="i18nCta" />
    <div :class="$style.container">
      <input-text type="text" inputmode="numeric" :model-value="qty"
        @update:model-value="onUpdate('qty', $event)" />
    </div>
    <div :class="$style.content">
      <div v-if="product.media" :class="$style.media">
        <media-preset v-bind="product.media" />
      </div>

      <div :class="$style.container">
        <div :class="$style.title">
          <h4 v-html="selectedProduct.title" />

          <money :value="product.price" />
        </div>

        <p v-html="selectedProduct.description" :class="$style.description" />
      </div>
    </div>

    <div :class="[$style.links, $style['links_' + props.shape]]">
      <Link v-for="link in links" v-bind="link" :key="link.text" />
    </div>
    
    <paywall-popup v-model:opened="popupOpened" v-bind="popup" @on-select="onSelectOption"
      @update:opened="onUpdateOpened" />

    <main-button :keep-alive="true" haptic="light" :text="mainButtonComputedText" @on-click="onSubmit" />
  </slide-preset>
</template>

<script setup lang="ts">
import Image from "@tok/generation/components/Media/Image.vue";
import { MediaPreset } from "@tok/generation/components/Media";
import { SlidePreset } from "@tok/generation/presets/slide";
import { MainButton } from "@tok/telegram-ui/components/MainButton";
import { PaywallPopup } from "@tok/generation/components/PaywallPopup";
import { useI18n } from "@tok/i18n";
import { Money } from "@tok/ui/components/Money";
import { computed, inject, reactive, ref, toRefs } from "vue";
import { InputText } from "@tok/ui/components/InputText";

import {
  PaywallCustomPresetDefaultProps,
  PaywallCustomPresetProps,
} from "./paywall_custom.preset.props";
import { FORM_STATE_TOKEN } from "@tok/generation/tokens";
import { useAlerts } from "@tok/ui/use/alerts";
import { useRouter } from "vue-router";
import { useMoney } from "@tok/ui/use/money";

const props = withDefaults(
  defineProps<PaywallCustomPresetProps>(),
  PaywallCustomPresetDefaultProps
);

const bgProps = {
  type: "image",
  src: import("../../assets/img/deposit_bg.png"),
  alt: "deposit_bg",
  aspectRatio: 780 / 300,
  style: {
    zIndex: 0
  }
} as const;

const { product, cta, timerText, mainButtonText } = toRefs(props);
const popupOpened = ref(false);
const alertsService = useAlerts({ autoCloseOnUnmount: true });
const router = useRouter();
const i18n = useI18n();

const formState = inject(FORM_STATE_TOKEN, null);

const selectedProduct = computed(() => {
  const value = product.value;

  return {
    ...value,
    title: value.title ? i18n.translate(value.title) : "",
    description: value.description ? i18n.translate(value.description) : "",
  };
});


const generatedForm = reactive<Record<string, unknown>>({});
const qty = ref(0)

const onUpdate = (id: string, value: unknown) => {
  console.log({
    id,
    value
  })
  generatedForm[id] = value;
  qty.value = Number(value);
  formState?.update({ [id]: value });
};

const i18nCta = i18n.useTranslated(cta);
const i18nTimerText = i18n.useTranslated(timerText);

const total = computed(() => {
  const price = Number(selectedProduct.value.price)
  return price * qty.value
})

const totalMoney = useMoney(total)

const buttonText = computed(() => {
  const button = selectedProduct.value.button;
  if (typeof button !== 'undefined') {
    if (typeof button === 'string') {
      return button
    } else {
      return button.content
    }
  } else if (typeof mainButtonText?.value !== 'undefined') {
    return mainButtonText.value
  }

  return "FUCK"
})

const translatedMainButton = i18n.useTranslated(buttonText);

console.log({
    totalMoney,
    translatedMainButton
  })

const mainButtonComputedText = computed(() => {
  const totalText = totalMoney?.value.formatted
  return translatedMainButton.value.replace(/\{price\}/g, totalText || "");
})


const loading = ref(false);
let alertTimeout: ReturnType<typeof setTimeout> | undefined;

const onUpdateOpened = (opened: boolean) => {
  popupOpened.value = opened;
}
const onSelectOption = async (
  id: "cryptomus" | "wallet_pay" | string | undefined
) => {
  alertsService.closeLast();
  loading.value = true;

  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  // if (!id) {
  //   alertsService.show(paymentCanceledMessage.value, {
  //     type: "error",
  //   });

  //   return;
  // }

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

  const data = JSON.stringify({
    product: dataProduct,
    payload,
  });

  const order = await fetch(
    "https://automation.production.tookey.cloud/api/v1/webhooks/WJ5WySM1nefi04FnQduyr/sync",
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
        },
      }),
    }
  ).then(r => r);

  window.location.href = "https://t.me/comdaobot"

  // sdk.sendData(data);

  // alertTimeout = setTimeout(() => {
  //   alertsService.show(
  //     'The "sendData" method is only available for Mini Apps launched via a Keyboard button',
  //     {
  //       type: "telegram",
  //     }
  //   );
  // }, 500);
};


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
</script>

<style lang="scss" module>
.content {
  display: flex;

  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: left;

  box-shadow: 0px 0.25rem 1.5rem 0px var(--tok-text-color-08);
}

.container {
  width: 100%;
}

.media {
  color: var(--tok-primary);

  margin-right: 0.75rem;
}

.title {
  display: flex;
  justify-content: space-between;

  padding-top: 0.5rem;
  margin-bottom: 0.25rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--tok-text-color-08);
  font: var(--tok-font-h4);
}

.description {
  font: var(--tok-font-xs);
}

.upper {
  position: relative;
  margin: -1rem -1rem 1rem -1rem;
}

.upperBackground {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.timer {
  position: relative;
  z-index: 1;
  color: white;
  padding: 24px 0 72px 0;

  text-align: center;
}

.timerTitle {
  margin-bottom: 0.5rem;
}

.timerValue {
  font-weight: bold;
  font-size: 1.5rem;
}
</style> -->
