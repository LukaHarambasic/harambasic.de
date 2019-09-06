<template>
  <section class="index">
    <page
      :is-first-cv="true"
      :logo-path="settings.logoPath"
      :footer-links="footer">
      <segment-header
        :name="person.name"
        :information="person.information"
        :image-path="settings.imagePath"
        :is-image-round="settings.isImageRound"
      />
      <div 
        class="main">
        <segment-list
          v-if="education"
          :title="education.title"
          :segments="education.segments"
          :use-timeline="settings.useTimeline"
          :justify-description="settings.justifyDescription"
        />
        <segment-list
          v-if="experienceFirstPage"
          :title="experienceFirstPage.title"
          :segments="experienceFirstPage.segments"
          :use-timeline="settings.useTimeline"
          :justify-description="settings.justifyDescription"
        />
      </div>
      <skills-list 
        v-if="skills"
        :title="skills.title"
        :lists="skills.lists"
        :show-skill-level="settings.showSkillLevel"
        :sort-skills-by="settings.showSkillsBy"
        :max-skill-level="settings.maxSkillLevel"
        class="skills"
      />
    </page>
    <page
      :logo-path="settings.logoPath"
      :footer-links="footer">
      <segment-list
        v-if="experienceSecondPage"
        :title="experienceSecondPage.title"
        :segments="experienceSecondPage.segments"
        :use-timeline="settings.useTimeline"
        :justify-description="settings.justifyDescription"
      />
      <segment-list
        v-if="voluntary"
        :title="voluntary.title"
        :segments="voluntary.segments"
        :use-timeline="settings.useTimeline"
        :justify-description="settings.justifyDescription"
        class="voluntary"
      />
    </page>
  </section>
</template>

<script>
import Page from "~/components/Page.vue";
import SegmentHeader from "~/components/SegmentHeader.vue";
import SegmentList from "~/components/SegmentList.vue";
import SkillsList from "~/components/SkillsList.vue";

import settings from "~/content/settings.yml";
import person from "~/content/person.yml";
import experienceFirstPage from "~/content/experienceFirstPage.yml";
import experienceSecondPage from "~/content/experienceSecondPage.yml";
import education from "~/content/education.yml";
import skills from "~/content/skills.yml";
import voluntary from "~/content/voluntary.yml";
import footer from "~/content/footer.yml";

export default {
  name: "Cv",
  components: {
    Page,
    SegmentHeader,
    SegmentList,
    SkillsList
  },
  data() {
    return {
      settings: settings,
      person: person,
      experienceFirstPage: experienceFirstPage,
      experienceSecondPage: experienceSecondPage,
      education: education,
      skills: skills,
      voluntary: voluntary,
      footer: footer
    };
  }
};
</script>

<style lang="scss" scoped>
.index {
  @media print {
    margin: 0;
    width: auto;
    height: auto;
  }
  @media screen and (max-width: $desktop) {
    width: 100%;
  }
  .main {
    width: 65%;
    @media screen and (max-width: $desktop) {
      width: 100%;
    }
  }
  .skills {
    width: 30%;
    @media screen and (max-width: $desktop) {
      width: 100%;
      margin: 1.5rem 0 0 0;
    }
  }
  .voluntary {
    @media screen and (max-width: $desktop) {
      margin: 0 0 2rem 0;
    }
  }
}
</style>
