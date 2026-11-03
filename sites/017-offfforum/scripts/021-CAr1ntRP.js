var e={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`Image`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`FileField`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`alt`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`focalPoint`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`x`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`y`},arguments:[],directives:[]}]}},{kind:`Field`,name:{kind:`Name`,value:`width`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`height`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`responsiveImage`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`srcSet`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`webpSrcSet`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`sizes`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`src`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`width`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`height`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`aspectRatio`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`alt`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`base64`},arguments:[],directives:[]}]}},{kind:`Field`,name:{kind:`Name`,value:`blurUpThumb`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`url`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`mimeType`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`format`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`filename`},arguments:[],directives:[]}]}}],loc:{start:0,end:360}};e.loc.source={body:`fragment Image on FileField {
    id
    alt
    focalPoint {
        x
        y
    }
    width
    height
    responsiveImage {
        srcSet
        webpSrcSet
        sizes
        src
        width
        height
        aspectRatio
        alt
        title
        base64
    }
    blurUpThumb
    title
    url
    mimeType
    format
    filename
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};function t(e,n){if(e.kind===`FragmentSpread`)n.add(e.name.value);else if(e.kind===`VariableDefinition`){var r=e.type;r.kind===`NamedType`&&n.add(r.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){t(e,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){t(e,n)}),e.definitions&&e.definitions.forEach(function(e){t(e,n)})}var n={};(function(){e.definitions.forEach(function(e){if(e.name){var r=new Set;t(e,r),n[e.name.value]=r}})})();function r(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function i(e,t){var i={kind:e.kind,definitions:[r(e,t)]};e.hasOwnProperty(`loc`)&&(i.loc=e.loc);var a=n[t]||new Set,o=new Set,s=new Set;for(a.forEach(function(e){s.add(e)});s.size>0;){var c=s;s=new Set,c.forEach(function(e){o.has(e)||(o.add(e),(n[e]||new Set).forEach(function(e){s.add(e)}))})}return o.forEach(function(t){var n=r(e,t);n&&i.definitions.push(n)}),i}i(e,`Image`);var a={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`LinkExternal`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`LinkExternalRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`label`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`url`},arguments:[],directives:[]}]}}],loc:{start:0,end:90}};a.loc.source={body:`fragment LinkExternal on LinkExternalRecord {
    _modelApiKey
    id
    label
    url
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};function o(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){o(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){o(e,t)}),e.definitions&&e.definitions.forEach(function(e){o(e,t)})}var s={};(function(){a.definitions.forEach(function(e){if(e.name){var t=new Set;o(e,t),s[e.name.value]=t}})})();function c(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function l(e,t){var n={kind:e.kind,definitions:[c(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=s[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(s[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=c(e,t);r&&n.definitions.push(r)}),n}l(a,`LinkExternal`);var u={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`LinkInternal`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`LinkInternalRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`label`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`link`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`HomepageRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]}]}},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`ScheduleRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]}]}},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`LineupRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]}]}},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`AboutRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]}]}},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`EventRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`slug`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`eventType`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`isArchive`},arguments:[],directives:[]}]}},{kind:`InlineFragment`,typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`ModularRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`slug`},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:660}};u.loc.source={body:`fragment LinkInternal on LinkInternalRecord {
    _modelApiKey
    id
    label
    link {
        ... on HomepageRecord {
            _modelApiKey
            id
        }
        ... on ScheduleRecord {
            _modelApiKey
            id
        }
        ... on LineupRecord {
            _modelApiKey
            id
        }
        ... on AboutRecord {
            _modelApiKey
            id
        }
        ... on EventRecord {
            _modelApiKey
            id
            slug
            eventType
            isArchive
        }
        ... on ModularRecord {
            _modelApiKey
            id
            slug
        }
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};function d(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){d(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){d(e,t)}),e.definitions&&e.definitions.forEach(function(e){d(e,t)})}var f={};(function(){u.definitions.forEach(function(e){if(e.name){var t=new Set;d(e,t),f[e.name.value]=t}})})();function p(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function m(e,t){var n={kind:e.kind,definitions:[p(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=f[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(f[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=p(e,t);r&&n.definitions.push(r)}),n}m(u,`LinkInternal`);var h={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`Video`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`FileField`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`alt`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`width`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`height`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`title`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`url`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`mimeType`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`format`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`filename`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`size`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`video`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`duration`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`framerate`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`mp4Url`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`width`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`height`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`blurUpThumb`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`muxPlaybackId`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`muxAssetId`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`streamingUrl`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`thumbnailUrl`},arguments:[],directives:[]}]}},{kind:`Field`,name:{kind:`Name`,value:`customData`},arguments:[],directives:[]}]}}],loc:{start:0,end:347}};h.loc.source={body:`fragment Video on FileField {
    id
    alt
    width
    height
    title
    url
    mimeType
    format
    filename
    size
    video {
        duration
        framerate
        mp4Url
        width
        height
        blurUpThumb
        muxPlaybackId
        muxAssetId
        streamingUrl
        thumbnailUrl
    }
    customData
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};function g(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){g(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){g(e,t)}),e.definitions&&e.definitions.forEach(function(e){g(e,t)})}var _={};(function(){h.definitions.forEach(function(e){if(e.name){var t=new Set;g(e,t),_[e.name.value]=t}})})();function v(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function y(e,t){var n={kind:e.kind,definitions:[v(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=_[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(_[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=v(e,t);r&&n.definitions.push(r)}),n}y(h,`Video`);var b={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`Media`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`MediaItemRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`image`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`Image`},directives:[]}]}},{kind:`Field`,name:{kind:`Name`,value:`video`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`FragmentSpread`,name:{kind:`Name`,value:`Video`},directives:[]}]}}]}}],loc:{start:0,end:177}};b.loc.source={body:`#import "./image.gql"
#import "./video.gql"

fragment Media on MediaItemRecord {
    _modelApiKey
    id
    image {
        ...Image
    }
    video {
        ...Video
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};var x={};function S(e){return e.filter(function(e){if(e.kind!==`FragmentDefinition`)return!0;var t=e.name.value;return!x[t]&&(x[t]=!0,!0)})}b.definitions=b.definitions.concat(S(e.definitions)),b.definitions=b.definitions.concat(S(h.definitions));function C(e,t){if(e.kind===`FragmentSpread`)t.add(e.name.value);else if(e.kind===`VariableDefinition`){var n=e.type;n.kind===`NamedType`&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){C(e,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){C(e,t)}),e.definitions&&e.definitions.forEach(function(e){C(e,t)})}var w={};(function(){b.definitions.forEach(function(e){if(e.name){var t=new Set;C(e,t),w[e.name.value]=t}})})();function T(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function E(e,t){var n={kind:e.kind,definitions:[T(e,t)]};e.hasOwnProperty(`loc`)&&(n.loc=e.loc);var r=w[t]||new Set,i=new Set,a=new Set;for(r.forEach(function(e){a.add(e)});a.size>0;){var o=a;a=new Set,o.forEach(function(e){i.has(e)||(i.add(e),(w[e]||new Set).forEach(function(e){a.add(e)}))})}return i.forEach(function(t){var r=T(e,t);r&&n.definitions.push(r)}),n}E(b,`Media`);export{e as i,u as n,a as r,b as t};