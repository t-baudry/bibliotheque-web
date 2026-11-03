import{_ as f,a as k}from"./Duj4vXvO.js";import{r as y,_ as i,u as h,c as x,b,d as v}from"#entry";import{d as p,c as _,k as m,l as r,a as L,o as s,m as C,p as E,u,j as P}from"./DSFEkcKy.js";import"./Dqai4u7s.js";import"./CkoA-ek_.js";const w={class:"legal-page-content"},D={key:1,class:"legal-page-content__text"},N=p({__name:"LegalPageContent",props:{page:{}},setup(a){const t={marks:{richTextLink:(o,{slots:c})=>{const{value:n}=o,e=y(n),l=n?.noNewTab?"_self":"_blank";return C("a",{href:e,target:l,rel:l==="_blank"?"noopener noreferrer":void 0},c.default?.())}}};return(o,c)=>{const n=f,e=k;return s(),_("section",w,[a.page?.title?(s(),m(n,{key:0,blok:{indent:!1,titlePrefix:"",titleEn:a.page.title,sectionName:"",info:[]}},null,8,["blok"])):r("",!0),a.page?.content?.length?(s(),_("article",D,[L(e,{value:a.page.content,components:t,serializers:t,class:"legal-page-content__blocks"},null,8,["value"])])):r("",!0)])}}}),B=Object.assign(i(N,[["__scopeId","data-v-ab30345d"]]),{__name:"LegalPageContent"}),S=`
  *[_type == "legalPage" && slug == $slug][0]{
    _id,
    _type,
    slug,
    title,
    seo{
      title,
      description,
      image{ asset->{ url } },
      keywords
    },
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "richTextLink" => {
          "internalDocument": internalDocument->{_type, slug},
          "anchorDocument": anchorDocument->{_type, slug}
        }
      }
    }
  }
`,$={class:"legal layout-block"},A=p({__name:"[slug]",async setup(a){let t,o;const c=h(),n=P(()=>c.params.slug),{data:e}=([t,o]=E(()=>v(S,{slug:n.value})),t=await t,o(),t);if(!e?.value)throw x({statusCode:404,statusMessage:"Page Not Found"});return b(e.value?.seo),(l,g)=>{const d=B;return s(),_("main",$,[u(e)?(s(),m(d,{key:0,page:u(e)},null,8,["page"])):r("",!0)])}}}),Q=i(A,[["__scopeId","data-v-82d112ed"]]);export{Q as default};
