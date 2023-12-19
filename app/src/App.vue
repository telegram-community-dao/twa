<template>
  <root />
</template>

<script setup lang="ts">
import { useTelegramSdk } from "@tok/telegram-ui/use/sdk";
import "./styles.scss";
import { Root } from "@tok/generation";
import { useRouter } from "vue-router";
import { watch } from "vue";
import { useAlerts } from "@tok/ui/use/alerts";

const telegram = useTelegramSdk();
const router = useRouter();
const alertsService = useAlerts({ autoCloseOnUnmount: true });

watch(router.currentRoute, (value) => {
  // fetch(
  //   "https://automation.production.tookey.cloud/api/v1/webhooks/VgejJORPlrPIUT5l8e1zd",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       initDataUnsafe: telegram.initDataUnsafe,
  //       initData: telegram.initData,
  //       route: {
  //         ...value,
  //         meta: {
  //           level:
  //             value.path === "/"
  //               ? Number(value.query.page || 0)
  //               : value.path === "/lp"
  //               ? 7
  //               : 0,
  //         },
  //         matched: undefined
  //       },
  //     }),
  //   }
  // );
  // alertsService?.show(
  //   `Route changed: ${value.fullPath} ${value.path} ${JSON.stringify(
  //     value.query,
  //     null,
  //     2
  //   )}`,
  //   {
  //     type: "info",
  //   }
  // );
});
telegram.enableClosingConfirmation();
</script>
