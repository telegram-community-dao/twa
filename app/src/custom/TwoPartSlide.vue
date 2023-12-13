<template>
  <div :class="$style.slide">
    <div ref="focusTrapRef" tabindex="0" :class="$style.focustrap" />

    <div :class="$style.header">
      <media-preset v-if="bg" v-bind="bg" :class="[$style.bg, $style['bg_' + shape]]" />

      <p v-if="carousel && pagination === 'count'" :class="$style.count">
        {{ slideCount }}
      </p>

      <h2 v-html="i18nUpperTitle" :class="$style.title" />
      <p v-if="i18nUpperDescription" v-html="i18nUpperDescription" :class="$style.description" />

      <media-preset v-if="media" v-bind="media" :class="[$style.media, $style['media_' + shape]]" />
    </div>

    <div :class="$style.content" :style="{ textAlign: textAlign, background: background }">
      <h2 v-html="i18nTitle" :class="$style.title" />

      <p v-if="i18nDescription" v-html="i18nDescription" :class="$style.description" />

      <ul v-if="computedList.length > 0">
        <list-item v-for="(item, index) in computedList" :key="index" v-bind="item" :class="$style.listItem" />
      </ul>

      <slot />

      <main-button v-if="active && buttonText" haptic="light" :keep-alive="!!carousel" :text="i18nButton"
        @on-click="onClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MainButton } from '@tok/telegram-ui/components/MainButton';
import { MediaPreset, MediaPresetProps } from "@tok/generation/components/Media";
import { ListItem } from "@tok/generation/components/ListItem";
import {
  SlidePresetProps,
  defaultSlideListMedia,
} from "@tok/generation/presets/slide";
import { useCarousel } from "@tok/generation/use/carousel";
import { useI18n } from "@tok/i18n";
import { computed, toRefs } from "vue";
import { RouteRecordRaw } from "vue-router";

type Props = SlidePresetProps & {
  bg?: MediaPresetProps;
  upperTitle: string;
  upperDescription: string;
};

const props = defineProps<Props>();

const { title, description, list, upperTitle, upperDescription, media, bg, button } =
  toRefs(props);

console.log(props, media);

const buttonText = computed(() => {
  const value = button.value;

  return typeof value === 'string' ? value : value ? value.content : '';
});

const buttonProps = computed<{ to?: RouteRecordRaw }>(() => {
  const value = button.value;

  return typeof value === 'string' ? {} : value || {};
});


const i18n = useI18n();
const carousel = useCarousel();

const i18nButton = i18n.useTranslated(buttonText);
const i18nTitle = i18n.useTranslated(title);
const i18nDescription = i18n.useTranslated(description);
const i18nUpperTitle = i18n.useTranslated(upperTitle);
const i18nUpperDescription = i18n.useTranslated(upperDescription);

const slideCount = computed(() => {
  if (!carousel) {
    return null;
  }

  return `${carousel.index.value + 1} / ${carousel.length.value}`;
});

const computedList = computed(() => {
  return (list?.value || []).map((item) => {
    if (typeof item === "string") {
      return {
        media: defaultSlideListMedia,
        text: item,
      };
    }

    return item;
  });
});

const onClick = () => {
  carousel?.next();
};
</script>

<style lang="scss" module>

* {
  text-wrap: balance;
}

.count {
  font: var(--tok-font-s);
  color: var(--tok-text-color-64);

  padding-top: 0.5rem;
}

.listItem:not(:first-child) {
  margin-top: 0.75rem;
}

.header {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  text-align: center;
  padding: 100px 24px 0px 24px;

  color: white;
  max-width: 100vw;
  max-height: 100vw;
  width: 100%;

  box-sizing: border-box;
  aspect-ratio: 1/1;
}
.content {
  padding: 24px;
}

.bg {
  width: 100%;
  display: block;
  position: absolute;
  bottom: 0;
  z-index: -1;
}

.media {
  flex-shrink: 1;
  flex-grow: 1;
  height: 0;
  margin-top: auto;
}

.title {
  margin-bottom: 16px;
}

.description {
  margin-bottom: 24px;
}

.slide {
  position: relative;
  min-height: var(--tg-viewport-stable-height, 100vh);
  height: 100%;
  max-height: var(--tg-viewport-stable-height, 100vh);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
