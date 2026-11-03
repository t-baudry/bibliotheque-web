const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./C8s35RMr.js","./Cggp7YJ0.js","./DSFEkcKy.js","./Dqai4u7s.js","./CkoA-ek_.js","./Dr7LQzdZ.js","./Duj4vXvO.js","./ARDv5Q2O.js","./CVYgohhJ.js","./D23mzIr-.js","./zh3UxZLU.js","./B2BpcFj8.js","./DTMFfZHG.js","./xIf3I70p.js","./C14NpV8_.js","./NhmqSoSP.js","./j0uihdgC.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./Dqai4u7s.js";import{d,o as c,c as u,F as f,e as g,k,z as h,l as b,A as o,p as E,t as P,a as L,u as v,g as x}from"./DSFEkcKy.js";import{k as A,j as C,d as I,b as T}from"#entry";import"./CkoA-ek_.js";const $={key:0},D=d({__name:"BlockRenderer",props:{blocks:{}},setup(a){const i={homeHero:o(()=>t(()=>import("./C8s35RMr.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url)),homeAbout:o(()=>t(()=>import("./Dr7LQzdZ.js"),__vite__mapDeps([5,6,1,2,3,4]),import.meta.url)),homeLargeText:o(()=>t(()=>import("./ARDv5Q2O.js"),__vite__mapDeps([7,1,2,3,4]),import.meta.url)),homeTeam:o(()=>t(()=>import("./CVYgohhJ.js"),__vite__mapDeps([8,6,1,2,3,4,9,10]),import.meta.url)),homePortfolio:o(()=>t(()=>import("./B2BpcFj8.js"),__vite__mapDeps([11,1,2,3,4,6,10,12]),import.meta.url)),homeWriting:o(()=>t(()=>import("./xIf3I70p.js"),__vite__mapDeps([13,6,1,2,3,4,9,10,14,15,12]),import.meta.url)),homeCareers:o(()=>t(()=>import("./j0uihdgC.js"),__vite__mapDeps([16,1,2,3,4,6,10,14,15]),import.meta.url)),homeThoughts:o(()=>t(()=>import("./xIf3I70p.js"),__vite__mapDeps([13,6,1,2,3,4,9,10,14,15,12]),import.meta.url))},l=r=>i[r]||"div";return(r,s)=>a.blocks&&a.blocks.length>0?(c(),u("div",$,[(c(!0),u(f,null,g(a.blocks,(e,n)=>(c(),k(h(l(e._type)),{key:e._key||e._id,blok:e,index:n},null,8,["blok","index"]))),128))])):b("",!0)}}),O=Object.assign(D,{__name:"SanityBlockRenderer"}),w=`
  seo{
    title,
    description,
    image,
    keywords
  }
`,_=`
  _id,
  title,
  description,
  "category": coalesce(category->value.current, category->title),
  "categoryLabel": category->title,
  "image": image{ "src": image.asset->url, alt },
  watchLink{ 
    linkHref, 
    linkLabel, 
    ariaLabel 
  }
`,p=`
  _id,
  _type,
  name,
  role,
  bio,
  "media": media[0]{ "type": "image", "src": image.asset->url, alt },
  social[]{
    _key,
    linkLabel,
    linkHref,
    ariaLabel
  },
  links[]{
    _key,
    linkLabel,
    linkHref,
    ariaLabel
  },
  quote[]{
    _key,
    _type,
    author,
    text
  }
`,B=`
  _id,
  "label": title,
  "value": value.current
`,N=`
  _id,
  "label": title,
  "value": value.current
`,m=`
  _id,
  _type,
  title,
  subtitle,
  "category": coalesce(category->value.current, category->title),
  "categoryLabel": category->title,
  description,
  "logo": logo{ "src": image.asset->url, alt },
  link{
    _key,
    _type,
    ariaLabel,
    linkType,
    linkLabel,
    linkHref,
    noNewTab,
    "internalDocument": internalDocument->{ _type, "slug": slug },
    "anchorDocument": anchorDocument->{ _type, "slug": slug },
    anchor
  }
`,R=`
  _key,
  _type,
  _type == "homeHero" => {
    title,
    popup{ title, text }
  },
  _type == "homeAbout" => {
    infoBlock{ indent, titlePrefix, titleEn, sectionName, info[]{ title, description } }
  },
  _type == "homeLargeText" => {
    lines
  },
  _type == "homeTeam" => {
    infoBlock{ indent, titlePrefix, titleEn, sectionName, info[]{ title, description } },
    "highlights": highlights[]->{ ${p} },
    "members": members[]->{ ${p} }
  },
  _type == "homePortfolio" => {
    portfolioMedia[]{ "src": image.asset->url, alt },
    infoBlock{ indent, titlePrefix, titleEn, sectionName, info[]{ title, description } },
    "portfolioItems": *[_type == "portfolioItem"] | order(_updatedAt desc){ ${m} },
    "portfolioCategories": *[_type == "portfolioCategory"] | order(title asc){ ${B} },
    "indexItems": *[_type == "portfolioItem"] | order(_updatedAt desc){ ${m} },
    spotlight{
      infoBlock{ indent, titlePrefix, titleEn, sectionName, info[]{ title, description } },
      "items": items[]->{ ${m} }
    }
  },
  _type == "homeWriting" => {
    featuredInfoBlock{ indent, titlePrefix, titleEn, sectionName, info[]{ title, description } },
    "featuredItems": coalesce(
      array::compact(featuredItems[]->{ ${_} }),
      array::compact(manualFeaturedItems[]->{ ${_} }),
      []
    ),
    allContentInfoBlock{ indent, titlePrefix, titleEn, sectionName, info[]{ title, description } },
    "writingCategories": *[_type == "writingCategory"] | order(title asc){ ${N} },
    "writingContentAll": *[_type == "writingContent"] | order(_updatedAt desc){ ${_} }
  },
  _type == "homeCareers" => {
    infoBlock{ indent, titlePrefix, titleEn, sectionName, info[]{ title, description } },
    "careerLinks": careerLinks[]->{
      _id,
      eyebrow,
      "text": coalesce(text, []),
      link{
        linkLabel,
        linkHref,
        ariaLabel
      }
    }
  }
`,V=`
  *[_type == "homepage"][0]{
    _id,
    _type,
    ${w},
    body[]{ ${R} }
  }
`,j={class:"index layout-block"},W=d({__name:"index",async setup(a){let i,l;const r=A(),s=x(null),e=C();try{const n=([i,l]=E(()=>I(V)),i=await i,l(),i);s.value=n.data.value??null}catch(n){console.error("Failed to fetch homepage data from Sanity.",n)}return T(s.value?.seo),P(()=>{r.anchor!==""&&e&&e.value&&setTimeout(()=>{e.value?.scrollTo(r.anchor.substring(1),{offset:-100,force:!0,duration:1.5}),r.anchor=""},500)}),(n,H)=>{const y=O;return c(),u("main",j,[L(y,{blocks:v(s)?.body??[]},null,8,["blocks"])])}}});export{W as default};
