<template>
  <carousel
    class="carousel"
    :navigation-enabled="true"
    :per-page="1"
    :navigation-click-target-size="24"
    pagination-active-color="#344BDE"
    pagination-color="#a4a8c2"
    :pagination-size="12"
  >
    <slide>
      <div class="testimonial">
        <div class="inner">
          <p class="description">
            Luka is einfach ein dufter Kerl und alles was er anfässt wird zu
            Gold.
          </p>
          <div class="information">
            <img class="picture" alt="Luka Harambasic" src="/profile.jpg" />
            <div class="name-position">
              <div class="name">Luka Harambasic</div>
              <div class="position">DTU</div>
            </div>
          </div>
        </div>
      </div>
    </slide>
    <slide>
      <div class="testimonial">
        <div class="inner">
          <p class="description">
            Luka is einfach ein dufter Kerl und alles was er anfässt wird zu
            Gold.
          </p>
          <div class="information">
            <img class="picture" alt="Luka Harambasic" src="/profile.jpg" />
            <div class="name-position">
              <div class="name">Luka Harambasic</div>
              <div class="position">DTU</div>
            </div>
          </div>
        </div>
      </div>
    </slide>
    <slide>
      <div class="testimonial">
        <div class="inner">
          <p class="description">
            Luka is einfach ein dufter Kerl und alles was er anfässt wird zu
            Gold.
          </p>
          <div class="information">
            <img class="picture" alt="Luka Harambasic" src="/profile.jpg" />
            <div class="name-position">
              <div class="name">Luka Harambasic</div>
              <div class="position">DTU</div>
            </div>
          </div>
        </div>
      </div>
    </slide>
  </carousel>
</template>

<script>
// Doesn't work with Nuxt without this "hack"
// https://github.com/SSENSE/vue-carousel/issues/81#issuecomment-363663139
import Carousel from 'vue-carousel/src/Carousel.vue'
import Slide from 'vue-carousel/src/Slide.vue'

export default {
  name: 'ServicesTestimonials',
  components: {
    Carousel,
    Slide,
  },
}
</script>

<style lang="sass" scoped>
.carousel
  &::v-deep
    .VueCarousel-navigation-button
      color: var(--c-font)
.testimonial
  padding: 0 2rem
  .inner
    background: var(--c-light)
    padding: 3rem
    border-radius: var(--border-radius)
    display: flex
    flex-direction: column
    flex-wrap: nowrap
    justify-content: flex-start
    align-content: flex-start
    align-items: center
    .description
      margin: 0 0 1rem 0
      font-style: italic
    .information
      display: flex
      flex-direction: row
      flex-wrap: nowrap
      justify-content: flex-start
      align-content: flex-start
      align-items: flex-start
      .picture
        width: 3rem
        height: 3rem
        border-radius: var(--border-radius-small)
      .name-position
        margin: 0 0 0 1rem
        .name
          font-weight: bold
          font-size: 1.2rem
          line-height: 1
        .position
          font-size: 0.9rem
</style>
