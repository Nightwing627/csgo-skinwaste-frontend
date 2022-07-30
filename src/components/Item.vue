<template>
  <div v-if="item.filler" class="item filler" />
  <div
    v-else
    class="item"
    :style="{ '--color': item.color }"
    :class="{ selected: item.selected, disabled: item.disabled }"
    @click="onClick"
  >
    <v-tooltip bottom color="rgba(0,0,0,0.7)" transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <!-- <v-hover
          v-slot="{ hover }"
        > -->
        <section v-bind="attrs" v-on="on">
          <v-img
            :transition="false"
            :aspect-ratio="1.2"
            :src="item.image"
            contain
          />
          <div class="inner">
            <div v-if="item.wear" class="itemattr-wear">
              {{ wearShort || item.wear | truncate(5) }}
            </div>
            <div class="itemattr-name text-truncate" :class="{ stattrak }">
              {{ (item.skin || item.market_name) | truncate(21) }}
              <span class=" mt-2"> $ {{ item.price | currencyInt }} </span>
            </div>
          </div>

          <!-- <transition name="fade" :duration="200">
              <v-overlay
                v-if="hover"
                absolute
                color="#2d3947"
                :opacity="0.5"
              >
                <div class="blur-background" />
                <v-img
                  class="translate-image-y"
                  :transition="false" :aspect-ratio="1.2" :src="item.image"
                  contain
                  min-width="120" min-height="120"
                />
              </v-overlay>
            </transition> -->
        </section>
        <!-- </v-hover> -->
      </template>

      <ItemName :item="item" />
    </v-tooltip>
  </div>
</template>

<script>
import ItemName from "./ItemName.vue";

const WEARS_SHORT = {
  "Factory New": "FN",
  "Minimal Wear": "MW",
  "Field-Tested": "FT",
  "Well-Worn": "WW",
  "Battle-Scarred": "BS"
};

export default {
  name: "ComponentItem",
  components: {
    ItemName
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      default: null
    }
  },
  computed: {
    item() {
      const item = this.data;
      if (item.color && !item.color.includes("#")) {
        item.color = `#${item.color}`;
      }
      return item;
    },
    wearShort() {
      if (!this.item.wear) {
        return false;
      }
      return WEARS_SHORT[this.item.wear];
    },
    stattrak() {
      // FIXME: move to backend
      return this.item.market_name.includes("StatTrak");
    }
  },
  methods: {
    onClick() {
      this.$emit("onClick", this.item);
    }
  }
};
</script>

<style lang="scss" scoped>
$stattrak: #cf6a32;

.item .stattrak {
  color: $stattrak !important;
}

.v-tooltip__content {
  padding: 0 5px;
  // transform: translateY(10px);
  margin-block-start: 5px;
}

@mixin transition-default() {
  &-enter-active,
  &-leave-active {
    transition: $primary-transition !important;
  }

  &-move {
    transition: transform 0.6s;
  }
}

.slide-y-transition {
  @include transition-default();

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(-15px);
  }
}

.translate-image-y {
  transform: translateY(-13px);
}

.item {
  overflow: hidden;
  position: relative;
  min-width: 150px;
  max-width: 160px;
  min-height: 160px;
  max-height: 200px;
  margin: 0 5px;
  border-radius: 7px;
  border-top: 2px solid rgba($light, 0.5);
  border-left: 2px solid rgba($light, 0.5);
  border-right: 2px solid rgba($light, 0.5);
  background-color: $grey500;
  cursor: pointer;
  flex: 1;
  opacity: 1;
  transition: background-color 0.4s ease;

  .transition {
    transition: visibility 0.7s ease, opacity 0.8s ease;
  }
  .opacity-0 {
    opacity: 0;
  }

  .fade-out {
    opacity: 0;
    visibility: hidden;
  }
  .fade-in {
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(4px) opacity(1);
  }

  &:hover {
    background-color: rgba(256, 256, 256, 0.025);
  }

  &::after {
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: /* gradient can be an image */ linear-gradient(
        to right,
        rgba($light, 0.5),
        rgba($light, 0.5) 10%,
        #82827400 10%,
        #d7f0a200 20%,
        var(--color) 20%,
        var(--color) 80%,
        #82827400 80%,
        #d7f0a200 90%,
        rgba($light, 0.5) 90%
      )
      left bottom no-repeat;
    content: " ";
  }

  &::v-deep .v-image {
    position: relative;
    z-index: 2;
    margin: 10px;
  }

  .inner {
    overflow: hidden;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 1 !important;
    user-select: none;

    .itemattr-price {
      position: absolute;
      top: 0;
      left: 0;
      padding: 5px 6px 5px 8px;
      color: $gold;
      background: $grey700;
      font-size: 12px;
      font-weight: bold;

      &::before {
        position: absolute;
        top: 0;
        right: -5px;
        width: 10px;
        height: 100%;
        background: inherit;
        content: "";
        transform: skewX(-25deg);
      }
    }

    .itemattr-wear {
      position: absolute;
      top: 0;
      left: 0;
      padding: 5px 8px 5px 6px;
      color: rgba($primary300, 0.5);
      // background: $grey700;
      text-shadow: 0 0 5px rgba(black, 0.3);
      font-size: 12px;
      font-weight: bold;

      &::before {
        position: absolute;
        top: 0;
        left: -5px;
        width: 10px;
        height: 100%;
        background: inherit;
        content: "";
        transform: skewX(25deg);
      }
    }

    .itemattr-user {
      position: absolute;
      top: 0;
      right: 0;
      padding: 8px;
    }

    .itemattr-name {
      display: flex;
      flex-direction: column;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 20px 4px 14px 4px;
      text-shadow: 0 0 5px rgba(black, 0.5);
      font-size: 14px;
      text-align: center;
      font-weight: 300;
      transition: all 0.3s ease;
      color: rgba($text, 0.4);

      span {
        color: rgba($text, 0.9);
      }
    }
  }

  .blur-background {
    position: absolute;
    top: -1rem;
    left: -1rem;
    right: -1rem;
    bottom: -1rem;
    background-color: transparent;
    backdrop-filter: blur(4px);
    z-index: -1;
  }

  &.filler {
    visibility: hidden;
    cursor: default;
  }

  &.disabled {
    opacity: 0.6;
    cursor: no-drop;
  }

  &.selected {
    border-color: $primary;
    background-color: rgba($primary, 0.1);
    .itemattr-wear {
      color: rgba($primary300, 0.7);
    }
    .itemattr-name {
      color: rgba($text, 1);

      span {
        color: rgba($text, 1);
        font-weight: 400;
      }
    }

    &::after {
      position: absolute;
      z-index: 3;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: /* gradient can be an image */ linear-gradient(
          to right,
          rgba($primary, 0.5),
          rgba($primary, 0.5) 10%,
          #82827400 10%,
          #d7f0a200 20%,
          var(--color) 20%,
          var(--color) 80%,
          #82827400 80%,
          #d7f0a200 90%,
          rgba($primary, 0.5) 90%
        )
        left bottom no-repeat;
      content: " ";
    }
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &::before {
    position: absolute;
    z-index: 3;
    bottom: 0;
    left: 12%;
    width: 90%;
    height: 1px;
    background: transparent;
    content: " ";
  }
}
</style>
