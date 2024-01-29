<template>
  <root />
</template>

<script setup lang="ts">
import { useTelegramSdk } from "@tok/telegram-ui/use/sdk";
import "./styles.scss";
import { Root } from "@tok/generation";
import { RouteLocationNormalizedLoaded, useRouter } from "vue-router";
import { inject, ref, watch } from "vue";
import { useAlerts } from "@tok/ui/use/alerts";
import { useI18n } from '@tok/i18n';
import { FORM_STATE_TOKEN } from "@tok/generation/tokens";

const telegram = useTelegramSdk();
const router = useRouter();
const alertsService = useAlerts({ autoCloseOnUnmount: true });
const i18n = useI18n();

const earnTranslatedTemplate = i18n.useTranslated("notifications.balance")

const formState = inject(FORM_STATE_TOKEN, null);

watch(router.currentRoute, (value, previous) => {
  const visited = JSON.parse(localStorage.getItem("visited_pages") ?? "[]");
  if (visited.includes(value.fullPath)) {
    return;
  }

  visited.push(value.fullPath);
  localStorage.setItem("visited_pages", JSON.stringify(Array.from(new Set(visited))));
  const levels: Partial<Record<string, (route: RouteLocationNormalizedLoaded) => number>> = {
    '/': (route: RouteLocationNormalizedLoaded) => Number(route.query.page || 0),
    '/lp': () => 7,
    '/select': () => 6
  }
  const level = levels[value.path]?.(value) || 0

  if (level > 0) {
    alertsService.closeLast()
    alertsService.show(earnTranslatedTemplate.value.replace("{amount}", "100").replace("{balance}", (level * 100).toString()), {
      type: 'success',
      autoClose: 3000
    })
  }
  if (import.meta.env.VITE_WEBHOOK_URL) {
    fetch(
      import.meta.env.VITE_WEBHOOK_URL + '/sync',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Math.random().toString(32).substring(2, 9),
          initDataUnsafe: telegram.initDataUnsafe,
          initData: telegram.initData,
          form: formState?.state.value,
          route: {
            ...value,
            meta: {
              level,
            },
            matched: undefined
          },
        }),
      }
    )
  }
});
telegram.enableClosingConfirmation();
</script>
