<template>
  <picture v-if="type === 'image'" v-bind="props" :class="$style.container">
    <source v-if="webp" type="image/webp" :srcset="loadedWebp" />

    <img
      v-bind="{ ...$attrs, ...props }"
      :src="loadedSrc"
      :class="[$style.img, static && $style.img_static]"
    />
  </picture>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import { ImagePresetProps } from './Media.preset.props';
import { useLoadedImage } from './useLoadedImage';

const props = defineProps<ImagePresetProps>();

const { src, webp, aspectRatio } = toRefs(props);

const computedAspectRatio = computed(() => aspectRatio?.value ?? 1);

const loadedSrc = useLoadedImage(src);
const loadedWebp = useLoadedImage(webp);
</script>

<style lang="scss" module>
.container {
  position: relative;
  aspect-ratio: v-bind(computedAspectRatio);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img {
  width: inherit;
  height: inherit;

  &:not(&_static) {
    position: absolute;
    z-index: -1;
  }
}
</style>
