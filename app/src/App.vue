<template>
  <root />
</template>

<script setup lang="ts">
import { useTelegramSdk } from '@tok/telegram-ui/use/sdk';
import './styles.scss';
import { Root } from '@tok/generation';

const telegram = useTelegramSdk()
telegram.enableClosingConfirmation()

</script>
