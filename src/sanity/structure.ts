import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

/** Studio navigation, grouped the way the site owner thinks about content. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("JAIMIN / BEYOND CODE")
    .items([
      S.listItem()
        .title("Overview")
        .child(
          S.list()
            .title("Overview")
            .items([
              S.listItem().title("Drafts & unverified").child(S.documentList().title("Needs attention").filter('(_id in path("drafts.**")) || verified == false').defaultOrdering([{ field: "_updatedAt", direction: "desc" }])),
              S.listItem().title("Recently edited").child(S.documentList().title("Recently edited").filter('!(_type in ["contactSubmission"])').defaultOrdering([{ field: "_updatedAt", direction: "desc" }])),
              S.listItem().title("Featured").child(S.documentList().title("Featured").filter("featured == true")),
              S.listItem().title("Scheduled posts").child(S.documentList().title("Scheduled posts").filter('_type == "blogPost" && publishedAt > now()')),
            ]),
        ),
      S.divider(),
      singleton(S, "personalProfile", "Personal profile"),
      singleton(S, "homePage", "Homepage"),
      singleton(S, "nowPage", "Now page"),
      S.divider(),
      S.listItem().title("Projects").child(S.list().title("Projects").items([S.documentTypeListItem("project").title("All projects"), S.documentTypeListItem("projectCategory").title("Categories")])),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.listItem().title("Blog").child(S.list().title("Blog").items([S.documentTypeListItem("blogPost").title("Posts"), S.documentTypeListItem("blogCategory").title("Categories"), S.documentTypeListItem("blogTag").title("Tags")])),
      S.listItem()
        .title("Career")
        .child(
          S.list()
            .title("Career")
            .items([
              S.documentTypeListItem("experience").title("Experience"),
              S.documentTypeListItem("education").title("Education"),
              S.documentTypeListItem("certification").title("Certifications"),
              S.documentTypeListItem("achievement").title("Metrics"),
              S.documentTypeListItem("testimonial").title("Testimonials"),
            ]),
        ),
      S.listItem().title("Skills").child(S.list().title("Skills").items([S.documentTypeListItem("skill").title("Skills"), S.documentTypeListItem("skillCategory").title("Categories")])),
      S.divider(),
      S.listItem()
        .title("Leads")
        .child(S.documentList().title("Contact submissions").filter('_type == "contactSubmission"').apiVersion("2026-10-01").defaultOrdering([{ field: "submittedAt", direction: "desc" }])),
      S.divider(),
      singleton(S, "navigation", "Navigation"),
      singleton(S, "siteSettings", "Global settings"),
      S.documentTypeListItem("socialLink").title("Social links"),
      S.documentTypeListItem("reusableCTA").title("Reusable CTAs"),
    ]);
