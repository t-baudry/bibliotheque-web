var e={kind:`Document`,definitions:[{kind:`FragmentDefinition`,name:{kind:`Name`,value:`LinkFile`},typeCondition:{kind:`NamedType`,name:{kind:`Name`,value:`LinkFileRecord`}},directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`_modelApiKey`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`id`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`label`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`file`},arguments:[],directives:[],selectionSet:{kind:`SelectionSet`,selections:[{kind:`Field`,name:{kind:`Name`,value:`filename`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`url`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`size`},arguments:[],directives:[]},{kind:`Field`,name:{kind:`Name`,value:`format`},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:148}};e.loc.source={body:`fragment LinkFile on LinkFileRecord {
    _modelApiKey
    id
    label
    file {
        filename
        url
        size
        format
    }
}
`,name:`GraphQL request`,locationOffset:{line:1,column:1}};function t(e,n){if(e.kind===`FragmentSpread`)n.add(e.name.value);else if(e.kind===`VariableDefinition`){var r=e.type;r.kind===`NamedType`&&n.add(r.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(e){t(e,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(e){t(e,n)}),e.definitions&&e.definitions.forEach(function(e){t(e,n)})}var n={};(function(){e.definitions.forEach(function(e){if(e.name){var r=new Set;t(e,r),n[e.name.value]=r}})})();function r(e,t){for(var n=0;n<e.definitions.length;n++){var r=e.definitions[n];if(r.name&&r.name.value==t)return r}}function i(e,t){var i={kind:e.kind,definitions:[r(e,t)]};e.hasOwnProperty(`loc`)&&(i.loc=e.loc);var a=n[t]||new Set,o=new Set,s=new Set;for(a.forEach(function(e){s.add(e)});s.size>0;){var c=s;s=new Set,c.forEach(function(e){o.has(e)||(o.add(e),(n[e]||new Set).forEach(function(e){s.add(e)}))})}return o.forEach(function(t){var n=r(e,t);n&&i.definitions.push(n)}),i}i(e,`LinkFile`);export{e as t};