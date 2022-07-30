<template>
  <div class="content">
    <h1 class="text-center">{{ message }}</h1>
    <div class="time-container">
      <div class="time" v-if="months != '00'">
        <div class="number">
          {{ months }}
        </div>
        <div class="name">
          Months
        </div>
      </div>
      <div class="double-dot" v-if="months != '00'">:</div>
      <div class="time" v-if="days != '00'">
        <div class="number">
          {{ days }}
        </div>
        <div class="name">
          Days
        </div>
      </div>
      <div class="double-dot" v-if="days != '00'">:</div>
      <div class="time">
        <div class="number">
          {{ hours }}
        </div>
        <div class="name">
          Hours
        </div>
      </div>
      <div class="double-dot">:</div>
      <div class="time">
        <div class="number">
          {{ minutes }}
        </div>
        <div class="name">
          Minutes
        </div>
      </div>
      <div class="double-dot">:</div>
      <div class="time">
        <div class="number">
          {{ seconds }}
        </div>
        <div class="name">
          Seconds
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CountdownPage",
  data() {
    return {
      message: "",
      months: "00",
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      interval: null,
    };
  },
  computed: {
    ...mapGetters(["config"])
  },
  mounted() {
    this.message = this.config.site.countdown.message;
    this.countdown();
  },
  methods: {
    countdown() {
      this.interval = setInterval(() => {
        const d = new Date();
        const end = new Date(this.config.site.countdown.end);
        const diff = new Date(end.getTime() - d.getTime());

        const months = diff.getMonth();
        const days = diff.getUTCDate();
        const hours = diff.getUTCHours();
        const minutes = diff.getUTCMinutes();
        const seconds = diff.getUTCSeconds();

        this.months = this.leadingZero(months);
        this.days = this.leadingZero(days);
        this.hours = this.leadingZero(hours);
        this.minutes = this.leadingZero(minutes);
        this.seconds = this.leadingZero(seconds);
      }, 1000);
    },
    leadingZero(numbers) {
      return numbers < 10 ? "0" + numbers : numbers;
    },
    followingS(number, text) {
      return number > 1 ? text + "s" : text;
    }
  },
  watch: {
    config: {
      handler() {
        clearInterval(this.interval);
        this.countdown();
        this.message = this.config.site.countdown.message;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.content{
    margin: 3rem 0 5rem 0;
}

.time-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;

  .double-dot {
    position: relative;
    top: 0;
    margin: 0 10px;
    font-size: 5em;
  }

  .time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .number {
      font-size: 5em;
      font-weight: bold;
    }

    .name {
      font-size: 1.5em;
      font-weight: bold;
    }
  }
}

@media (max-width: 768px) {
  .time-container {
    .double-dot {
      font-size: 1em;
    }
    .time {
      .number {
        font-size: 1em;
      }
      .name {
        font-size: 1em;
      }
    }
  }
}
</style>
