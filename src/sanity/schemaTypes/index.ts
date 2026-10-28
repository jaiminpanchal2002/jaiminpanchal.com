import { accessibleImage, ctaType, richTextType, seoType } from "./shared";
import { homePage, navigation, nowPage, personalProfile, siteSettings } from "./singletons";
import {
  achievement,
  blogCategory,
  blogPost,
  blogTag,
  caseStudy,
  certification,
  contactSubmission,
  education,
  experience,
  project,
  projectCategory,
  reusableCTA,
  skill,
  skillCategory,
  socialLink,
  testimonial,
} from "./documents";

export const schemaTypes = [
  // objects
  seoType,
  accessibleImage,
  ctaType,
  richTextType,
  // singletons
  siteSettings,
  navigation,
  personalProfile,
  homePage,
  nowPage,
  // documents
  project,
  projectCategory,
  caseStudy,
  blogPost,
  blogCategory,
  blogTag,
  experience,
  education,
  certification,
  skill,
  skillCategory,
  achievement,
  testimonial,
  socialLink,
  reusableCTA,
  contactSubmission,
];

export const singletonTypes = new Set(["siteSettings", "navigation", "personalProfile", "homePage", "nowPage"]);
