import { defineConfig } from "@tok/generation";
import TwoPartSlide from "./custom/TwoPartSlide.vue";
import { PaywallCustomPreset } from "./custom/paywall_custom";

export default defineConfig({
  definePresets: {
    two_part: TwoPartSlide,
    paywall_custom: PaywallCustomPreset,
  },
  // If you want to add language/currency localization – see ./examples/meditation as reference
  locale: {
    fallback: "en",
    ru: import("./locales/ru.json"),
    en: import("./locales/en.json"),
  },
  pages: [
    {
      slides: [
        {
          extends: "two_part",
          media: {
            type: "sticker",
            src: import("./assets/stickers/duck_cool.tgs"),
            aspectRatio: 1,
          },
          bg: {
            type: "image",
            src: import("./assets/img/main-2.png"),
            aspectRatio: 1,
          },
          title: "p1.lower.title",
          description: "p1.lower.description",
          upperTitle: "p1.upper.title",
          upperDescription: "p1.upper.description",
          textAlign: "center",
          button: "p1.button",
        },
        {
          media: {
            type: "image",
            src: import("./assets/img/image-2.png"),
            aspectRatio: 3 / 2,
          },
          title: "s2.title",
          description: "s2.description",
          button: "p2.button",
        },
        {
          extends: "slide",
          media: {
            type: "sticker",
            src: import("./assets/stickers/duck_stocks.tgs"),
            size: 220,
            aspectRatio: 3 / 2,
          },
          title: "s3.title",
          description: "s3.description",
          button: "p3.button",
        },
        {
          extends: "slide",
          media: {
            type: "sticker",
            src: import("./assets/stickers/duck_community.tgs"),
            size: 220,
            aspectRatio: 3 / 2,
          },
          title: "s4.title",
          description: "s4.description",
          button: {
            content: "s4.button",
          },
        },
        {
          extends: "paywall",
          media: {
            type: "sticker",
            src: import("./assets/stickers/duck_invite.tgs"),
            size: 220,
            aspectRatio: 2 / 1,
          },
          title: "sub.title",
          list: ["sub.list.0", "sub.list.1", "sub.list.2", "sub.list.3"],
          links: [
            {
              text: "sub.links.0.text",
              href: "sub.links.0.href",
            },
          ],
          products: [
            {
              id: "year",
              title: "sub.products.0.title",
              description: "sub.products.0.description",
              discount: "sub.products.0.discount",
              price: 1200,
            },
            {
              id: "month",
              title: "sub.products.1.title",
              description: "sub.products.1.description",
              discount: "sub.products.1.discount",
              price: 250,
            },
            {
              id: "lp",
              title: "sub.products.2.title",
              description: "sub.products.2.description",
              price: "sub.products.2.price",
              button: {
                content: "sub.products.2.button",
                to: "/lp",
              },
            },
          ],
          mainButtonText: "sub.button",
          popup: {
            buttons: [
              {
                id: "wallet_pay",
                media: {
                  type: "emodji" as const,
                  src: "👛",
                },
                type: "default" as const,
                text: "Wallet pay",
              },
            ],
          },
        },
      ],
    },
    {
      extends: "paywall_custom",
      title: "buy.title",
      timerText: "buy.timer.title",
      endTime: 1999999999,
      cta: "buy.cta.title",
      product: {
        title: "buy.product.title",
        description: "buy.product.description",
        price: 0.01,
      },
      list: ["buy.list.0", "buy.list.1", "buy.list.2"],
      description: "buy.description",
      path: "/lp",
      mainButtonText: "buy.button",
      button: {
        content: "buy.button",
      },
      links: [
        {
          text: "sub.links.0.text",
          href: "sub.links.0.href",
        },
      ],
    },
  ],
});
