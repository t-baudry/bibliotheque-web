import{B as e,H as t,It as n,Q as r,S as i,b as a,d as o,dt as s,f as ee,i as te,m as c,u as l,vt as u,z as d}from"./DtO87taH.js";import{Bt as f,Ft as p}from"./Cdnf07N5.js";import{n as ne}from"./Dzio7UU0.js";import{n as re,t as m}from"./CIpyt11F.js";import{i as h,n as g,r as _,t as v}from"./CAr1ntRP.js";import{f as ie,i as y}from"#entry";import{t as ae}from"./ghe8mhtO.js";import{t as oe}from"./CcYuxyOg.js";import{t as se}from"./CjAnavkC.js";import{t as ce}from"./bPnh-slD.js";import{n as le,t as ue}from"./bsCyo_AX.js";import{t as de}from"./BJqR9hUd.js";import{t as b}from"./CCxUMj6X.js";var x={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`WysiwygSection`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`WysiwygRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`content`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`value`},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:103}};x.loc.source={body:`fragment WysiwygSection on WysiwygRecord {
    _modelApiKey
    id
    content {
        value
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};function S(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){S(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){S(e,t)}),e.definitions&&e.definitions.forEach(function(e){S(e,t)})}var C={};(function(){x.definitions.forEach(function(e){if(e.name){var t=new Set;S(e,t),C[e.name.value]=t}})})();function w(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function fe(e,t){var n={kind:e.kind,definitions:[w(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=C[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(C[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=w(e,t);r&&n.definitions.push(r)}),n}fe(x,`WysiwygSection`);var T={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`TitleContentGroupSection`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`TitleContentGroupRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`titleContentSections`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`content`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`Media`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`WysiwygSection`},directives:[]},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`ForumItemsSectionRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`items`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`label`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`link`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`LinkInternal`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`LinkExternal`},directives:[]}]}}]}}]}},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`LinksSectionRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`buttonMode`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`links`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`LinkInternal`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`LinkExternal`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`LinkFile`},directives:[]}]}}]}},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`ContactGroupRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`items`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`name`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`mail`},arguments:[],directives:[]}]}}]}}]}}]}}]}}],loc:{start:0,end:1205}};T.loc.source={body:`#import '../media.gql'
#import '../linkInternal.gql'
#import '../linkExternal.gql'
#import '../linkFile.gql'
#import './wysiwyg.gql'

fragment TitleContentGroupSection on TitleContentGroupRecord {
    _modelApiKey
    id
    titleContentSections {
        id
        title
        content {
            ...Media
            ...WysiwygSection
            ... on ForumItemsSectionRecord {
                id
                _modelApiKey
                items {
                    id
                    label
                    link {
                        ...LinkInternal
                        ...LinkExternal
                    }
                }
            }
            ... on LinksSectionRecord {
                id
                _modelApiKey
                buttonMode
                links {
                    ...LinkInternal
                    ...LinkExternal
                    ...LinkFile
                }
            }
            ... on ContactGroupRecord {
                id
                _modelApiKey
                items {
                    id
                    title
                    name
                    mail
                }
            }
        }
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};var E={};function D(e){return e.filter(function(e){if(e.kind!==`FragmentDefinition`)return!0;var t=e.name.value;return!E[t]&&(E[t]=!0,!0)})}T.definitions=T.definitions.concat(D(v.definitions)),T.definitions=T.definitions.concat(D(g.definitions)),T.definitions=T.definitions.concat(D(_.definitions)),T.definitions=T.definitions.concat(D(b.definitions)),T.definitions=T.definitions.concat(D(x.definitions));function O(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){O(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){O(e,t)}),e.definitions&&e.definitions.forEach(function(e){O(e,t)})}var k={};(function(){T.definitions.forEach(function(e){if(e.name){var t=new Set;O(e,t),k[e.name.value]=t}})})();function A(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function pe(e,t){var n={kind:e.kind,definitions:[A(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=k[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(k[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=A(e,t);r&&n.definitions.push(r)}),n}pe(T,`TitleContentGroupSection`);var j={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`AccordionsGroupSection`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`AccordionsGroupRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`accordionsSections`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`accordions`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`text`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`links`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`LinkInternal`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`LinkExternal`},directives:[]}]}}]}}]}}]}}],loc:{start:0,end:381}};j.loc.source={body:`#import '../linkInternal.gql'
#import '../linkExternal.gql'

fragment AccordionsGroupSection on AccordionsGroupRecord {
    _modelApiKey
    id
    accordionsSections {
        id
        title
        accordions {
            id
            title
            text
            links {
                ...LinkInternal
                ...LinkExternal
            }
        }
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};var M={};function N(e){return e.filter(function(e){if(e.kind!==`FragmentDefinition`)return!0;var t=e.name.value;return!M[t]&&(M[t]=!0,!0)})}j.definitions=j.definitions.concat(N(g.definitions)),j.definitions=j.definitions.concat(N(_.definitions));function P(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){P(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){P(e,t)}),e.definitions&&e.definitions.forEach(function(e){P(e,t)})}var F={};(function(){j.definitions.forEach(function(e){if(e.name){var t=new Set;P(e,t),F[e.name.value]=t}})})();function I(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function me(e,t){var n={kind:e.kind,definitions:[I(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=F[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(F[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=I(e,t);r&&n.definitions.push(r)}),n}me(j,`AccordionsGroupSection`);var L={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`GallerySection`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`GalleryRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`images`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`Image`},directives:[]}]}}]}}],loc:{start:0,end:139}};L.loc.source={body:`#import '../image.gql'

fragment GallerySection on GalleryRecord {
    id
    _modelApiKey
    title
    images {
        ...Image
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};var R={};function he(e){return e.filter(function(e){if(e.kind!==`FragmentDefinition`)return!0;var t=e.name.value;return!R[t]&&(R[t]=!0,!0)})}L.definitions=L.definitions.concat(he(h.definitions));function z(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){z(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){z(e,t)}),e.definitions&&e.definitions.forEach(function(e){z(e,t)})}var B={};(function(){L.definitions.forEach(function(e){if(e.name){var t=new Set;z(e,t),B[e.name.value]=t}})})();function V(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function ge(e,t){var n={kind:e.kind,definitions:[V(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=B[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(B[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=V(e,t);r&&n.definitions.push(r)}),n}ge(L,`GallerySection`);var H={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`VideoGallerySection`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`VideoGalleryRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`videos`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`label`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`thumbnail`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`Media`},directives:[]}]}},{kind:`Field`,name:{kind:`Name`,value:`vimeoId`},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:227}};H.loc.source={body:`#import '../media.gql'

fragment VideoGallerySection on VideoGalleryRecord {
    id
    _modelApiKey
    title
    videos {
        title
        label
        thumbnail {
            ...Media
        }
        vimeoId
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};var U={};function _e(e){return e.filter(function(e){if(e.kind!==`FragmentDefinition`)return!0;var t=e.name.value;return!U[t]&&(U[t]=!0,!0)})}H.definitions=H.definitions.concat(_e(v.definitions));function W(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){W(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){W(e,t)}),e.definitions&&e.definitions.forEach(function(e){W(e,t)})}var G={};(function(){H.definitions.forEach(function(e){if(e.name){var t=new Set;W(e,t),G[e.name.value]=t}})})();function K(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function ve(e,t){var n={kind:e.kind,definitions:[K(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=G[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(G[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=K(e,t);r&&n.definitions.push(r)}),n}ve(H,`VideoGallerySection`);var q={kind:`Document`,definitions:[{kind:`OperationDefinition`,operation:`query`,name:{kind:`Name`,value:`pageModularQuery`},variableDefinitions:[{kind:`VariableDefinition`,variable:{kind:`Variable`,name:{kind:`Name`,value:`locale`}},type:{kind:`NamedType`,name:{kind:`Name`,value:`SiteLocale`}},directives:[]},{kind:`VariableDefinition`,variable:{kind:`Variable`,name:{kind:`Name`,value:`slug`}},type:{kind:`NonNullType`,type:{kind:`NamedType`,name:{kind:`Name`,value:`String`}}},directives:[]}],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,alias:{kind:`Name`,value:`page`},name:{kind:`Name`,value:`modular`},arguments:[{kind:`Argument`,name:{kind:`Name`,value:`locale`},value:{kind:`Variable`,name:{kind:`Name`,value:`locale`}}},{kind:`Argument`,name:{kind:`Name`,value:`filter`},value:{kind:`ObjectValue`,fields:[{kind:`ObjectField`,name:{kind:`Name`,value:`slug`},value:{kind:`ObjectValue`,fields:[{kind:`ObjectField`,name:{kind:`Name`,value:`eq`},value:{kind:`Variable`,name:{kind:`Name`,value:`slug`}}}]}}]}}],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`hasGreyBackground`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`subtitle`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`slug`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`_allSlugLocales`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`locale`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`value`},arguments:[],directives:[]}]}},{kind:`Field`,name:{kind:`Name`,value:`sections`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`TitleContentGroupSection`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`WysiwygSection`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`AccordionsGroupSection`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`SpeakersListSection`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`GallerySection`},directives:[]},{kind:`FragmentSpread`,name:{kind:`Name`,value:`VideoGallerySection`},directives:[]}]}},{kind:`Field`,alias:{kind:`Name`,value:`seo`},name:{kind:`Name`,value:`_seoMetaTags`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`SeoTag`},directives:[]}]}}]}}]}}],loc:{start:0,end:934}};q.loc.source={body:`#import '../fragments/seoTag.gql'
#import '../fragments/sections/titleContentGroup.gql'
#import '../fragments/sections/wysiwyg.gql'
#import '../fragments/sections/accordions.gql'
#import '../fragments/sections/speakersList.gql'
#import '../fragments/sections/gallery.gql'
#import '../fragments/sections/videoGallery.gql'

query pageModularQuery($locale: SiteLocale, $slug: String!) {
    page: modular(locale: $locale, filter: { slug: { eq: $slug } }) {
        id
        _modelApiKey
        hasGreyBackground
        title
        subtitle
        slug
        _allSlugLocales {
            locale
            value
        }
        sections {
            ...TitleContentGroupSection
            ...WysiwygSection
            ...AccordionsGroupSection
            ...SpeakersListSection
            ...GallerySection
            ...VideoGallerySection
        }
        seo: _seoMetaTags {
            ...SeoTag
        }
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};var J={};function Y(e){return e.filter(function(e){if(e.kind!==`FragmentDefinition`)return!0;var t=e.name.value;return!J[t]&&(J[t]=!0,!0)})}q.definitions=q.definitions.concat(Y(m.definitions)),q.definitions=q.definitions.concat(Y(T.definitions)),q.definitions=q.definitions.concat(Y(x.definitions)),q.definitions=q.definitions.concat(Y(j.definitions)),q.definitions=q.definitions.concat(Y(y.definitions)),q.definitions=q.definitions.concat(Y(L.definitions)),q.definitions=q.definitions.concat(Y(H.definitions));function X(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){X(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){X(e,t)}),e.definitions&&e.definitions.forEach(function(e){X(e,t)})}var Z={};(function(){q.definitions.forEach(function(e){if(e.name){var t=new Set;X(e,t),Z[e.name.value]=t}})})();function Q(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function $(e,t){var n={kind:e.kind,definitions:[Q(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=Z[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(Z[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=Q(e,t);r&&n.definitions.push(r)}),n}$(q,`pageModularQuery`);var ye={class:`page-inner`},be={class:`page-content pt-header-height`},xe={class:`container-main`},Se={class:`flex flex-col gap-70 py-70 md:gap-120 md:py-120`},Ce=i({__name:`[slug]`,async setup(i){let m,h,{locale:g}=ne(),{slug:_}=f().params,v=s(null);try{let{data:e}=([m,h]=r(()=>re({query:q,options:{variables:{locale:g.value,slug:_}}})),m=await m,h(),m);e.value&&(v.value=e.value.page)}catch(e){throw console.log(`catch error: `,e),p({statusCode:404,statusMessage:`Page Not Found`,fatal:!0})}if(!v.value)throw p({statusCode:404,statusMessage:`Page Not Found`,fatal:!0});le({pageTransition:ie});let y=s(null);e(`root`,y),de(v.value._allSlugLocales),ue(v.value.seo);let b=l(()=>v.value.hasGreyBackground);return(e,r)=>{let i=oe,s=se,l=ce,f=ae;return d(),c(`div`,{ref_key:`root`,ref:y,class:n([`page relative`,{"bg-[#e2e2e2]":u(b)}])},[o(`div`,ye,[a(i,{theme:`dark`}),o(`div`,be,[o(`div`,xe,[a(s,{title:u(v).title,subtitle:u(v).subtitle},null,8,[`title`,`subtitle`])]),o(`div`,Se,[(d(!0),c(te,null,t(u(v).sections,e=>(d(),ee(l,{key:e.id,section:e},null,8,[`section`]))),128))])]),a(f)])],2)}}});export{Ce as default};