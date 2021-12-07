(window.webpackJsonp=window.webpackJsonp||[]).push([[85],{156:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return p}));var a=n(3),l=n(7),r=(n(0),n(254)),s={title:"Pulse",description:"Memory and lifetime analysis."},i={unversionedId:"checker-pulse",id:"checker-pulse",isDocsHomePage:!1,title:"Pulse",description:"Memory and lifetime analysis.",source:"@site/docs/checker-pulse.md",slug:"/checker-pulse",permalink:"/docs/next/checker-pulse",version:"current",sidebar:"docs",previous:{title:"`printf()` Argument Types",permalink:"/docs/next/checker-printf-args"},next:{title:"Purity",permalink:"/docs/next/checker-purity"}},c=[{value:"What is Infer:Pulse?",id:"what-is-inferpulse",children:[]},{value:"Latent Issues",id:"latent-issues",children:[]},{value:"Unknown Functions",id:"unknown-functions",children:[]},{value:"Pulse x Nullsafe",id:"pulse-x-nullsafe",children:[]},{value:"List of Issue Types",id:"list-of-issue-types",children:[]}],o={toc:c};function p(e){var t=e.components,n=Object(l.a)(e,["components"]);return Object(r.b)("wrapper",Object(a.a)({},o,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"Memory and lifetime analysis."),Object(r.b)("p",null,"Activate with ",Object(r.b)("inlineCode",{parentName:"p"},"--pulse"),"."),Object(r.b)("p",null,"Supported languages:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},"C/C++/ObjC: Yes"),Object(r.b)("li",{parentName:"ul"},"C#/.Net: No"),Object(r.b)("li",{parentName:"ul"},"Erlang: Yes"),Object(r.b)("li",{parentName:"ul"},"Java: Yes")),Object(r.b)("h2",{id:"what-is-inferpulse"},"What is Infer:Pulse?"),Object(r.b)("p",null,"Pulse is an interprocedural memory safety analysis. Pulse can detect, for instance, ",Object(r.b)("a",{parentName:"p",href:"/docs/next/all-issue-types#nullptr_dereference"},"Null dereferences")," in Java. Errors are only reported when all conditions on the erroneous path are true regardless of input. Pulse should gradually replace the original ",Object(r.b)("a",{parentName:"p",href:"/docs/next/checker-biabduction"},"biabduction")," analysis of Infer. An example of a Null dereference found by Pulse is given below."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-java"},"class Person {\n    Person emergencyContact;\n    String address;\n\n    Person getEmergencyContact() {\n        return this.emergencyContact;\n    }\n}\n\nclass Registry {\n    void create() {\n        Person p = new Person();\n        Person c = p.getEmergencyContact();\n        // Null dereference here\n        System.out.println(c.address);\n    }\n\n    void printContact(Person p) {\n        // No null dereference, as we don't know anything about `p`\n        System.out.println(p.getEmergencyContact().address);\n    }\n}\n")),Object(r.b)("p",null,"How to run pulse for Java:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-bash"},"infer run --pulse -- javac Test.java\n")),Object(r.b)("p",null,"Pulse reports a Null dereference on this file on ",Object(r.b)("inlineCode",{parentName:"p"},"create()"),", as it tries to access the field ",Object(r.b)("inlineCode",{parentName:"p"},"address")," of object ",Object(r.b)("inlineCode",{parentName:"p"},"c"),", and ",Object(r.b)("inlineCode",{parentName:"p"},"c")," has value ",Object(r.b)("inlineCode",{parentName:"p"},"null"),". In contrast, Pulse gives no report for ",Object(r.b)("inlineCode",{parentName:"p"},"printContact(Person p)"),", as we cannot be sure that ",Object(r.b)("inlineCode",{parentName:"p"},"p.getEmergencyContact()")," will return ",Object(r.b)("inlineCode",{parentName:"p"},"null"),". But, thanks to the fact that the analysis is ",Object(r.b)("em",{parentName:"p"},"inter-procedural"),", Pulse will report a Null dereference on calls to ",Object(r.b)("inlineCode",{parentName:"p"},"printContact(p)")," when it detects that ",Object(r.b)("inlineCode",{parentName:"p"},"p")," is null."),Object(r.b)("h2",{id:"latent-issues"},"Latent Issues"),Object(r.b)("p",null,"When an error can occur only on some values of the parameters of the current function, Pulse does not report an issue. Such issues are called ",Object(r.b)("em",{parentName:"p"},"latent"),". But, if Pulse then sees a call site at which all the conditions for the error are satisfied then the error becomes ",Object(r.b)("em",{parentName:"p"},"manifest")," and is reported. This example (in C) illustrates how latent issues are created and then reported when they become manifest:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-c"},"// for more realism, imagine that this function does other things as well\nvoid set_to_null_if_positive(int n, int* p) {\n  if (n > 0) {\n    p = NULL;\n  }\n}\n\nvoid latent_null_dereference(int n, int* p) {\n  set_to_null_if_positive(n, p);\n  *p = 42; // NULL dereference! but only if n > 0 so no report yet\n}\n\nvoid manifest_error(int *p) {\n  // no way to avoid the bug here => Pulse reports an error\n  latent_null_dereference(1, p);\n}\n")),Object(r.b)("h2",{id:"unknown-functions"},"Unknown Functions"),Object(r.b)("p",null,"In order to avoid false positives, Pulse makes optimistic assumptions about calls to unknown functions. Unknown functions (or unknown methods) are functions for which Infer didn't find any code. For example, it could be because the function belongs to a third-party library and we know only its signature, or because a function is made through a function pointer that Pulse wasn't able to resolve to a concrete function. In either case, Pulse will scramble the parts of the state reachable from the parameters of the call. In general, this helps avoid false positives but note that this may cause false negatives as well as false positives:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-c"},"void unknown(int* p); // third-party code that does [*p = 5]\n                      // Infer doesn't have access to that code\n\nvoid false_negative() {\n  int* x = (int*) malloc(sizeof(int));\n  if (x) {\n    // unknown call to x makes Pulse forget that x was allocated, in case it frees x\n    unknown(x); \n  }\n} // no memory leak reported: false negative!\n\nvoid false_positive(int *x) {\n  unknown(x); // this sets *x to 5\n  if (x != 5) {\n    // unreachable\n    int* p = NULL;\n    *p = 42; // false positive reported here\n  }\n}\n")),Object(r.b)("p",null,"You can check if a given function called any unknown functions by inspecting its Pulse summary. For example, for the code above:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-console"},"$ infer --pulse-only -- clang -c unknown_code.c\n  No issues found\n$ infer debug --procedures --procedures-filter 'false_negative' --procedures-summary\n...\n    skipped_calls={ unknown -> call to skipped function occurs here }\n")),Object(r.b)("h2",{id:"pulse-x-nullsafe"},"Pulse x Nullsafe"),Object(r.b)("p",null,Object(r.b)("a",{parentName:"p",href:"/docs/next/checker-eradicate"},"Nullsafe")," is a type checker for ",Object(r.b)("inlineCode",{parentName:"p"},"@Nullable")," annotations for Java. Classes following the Nullsafe discipline are annotated with ",Object(r.b)("inlineCode",{parentName:"p"},"@Nullsafe"),"."),Object(r.b)("p",null,"Consider the classes ",Object(r.b)("inlineCode",{parentName:"p"},"Person")," and ",Object(r.b)("inlineCode",{parentName:"p"},"Registry")," from the previous example. Assuming that class ",Object(r.b)("inlineCode",{parentName:"p"},"Person")," is annotated with ",Object(r.b)("inlineCode",{parentName:"p"},"@Nullsafe"),". In this case, we also annotate ",Object(r.b)("inlineCode",{parentName:"p"},"getEmergencyContact()")," with ",Object(r.b)("inlineCode",{parentName:"p"},"@Nullable"),", to make explicit that this method can return the ",Object(r.b)("inlineCode",{parentName:"p"},"null")," value. There is still the risk that classes depending on ",Object(r.b)("inlineCode",{parentName:"p"},"Person")," have Null dereferences. In this case, Pulse would report a Null dereference on ",Object(r.b)("inlineCode",{parentName:"p"},"Registry"),". It could also be the case that class ",Object(r.b)("inlineCode",{parentName:"p"},"Registry")," is annotated with ",Object(r.b)("inlineCode",{parentName:"p"},"@Nullsafe"),". By default Pulse reports on ",Object(r.b)("inlineCode",{parentName:"p"},"@Nullsafe")," files too, see the ",Object(r.b)("inlineCode",{parentName:"p"},"--pulse-nullsafe-report-npe")," option (Facebook-specific: Pulse does not report on ",Object(r.b)("inlineCode",{parentName:"p"},"@Nullsafe")," files)."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-java"},"@Nullsafe(Nullsafe.Mode.LOCAL)\nclass Person {\n    Person emergencyContact;\n    String address;\n\n    @Nullable Person getEmergencyContact() {\n        return this.emergencyContact;\n    }\n}\n\nclass Registry {\n    ... // Pulse reports here\n}\n")),Object(r.b)("h2",{id:"list-of-issue-types"},"List of Issue Types"),Object(r.b)("p",null,"The following issue types are reported by this checker:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#bad_key"},"BAD_KEY")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#bad_key_latent"},"BAD_KEY_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#bad_map"},"BAD_MAP")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#bad_map_latent"},"BAD_MAP_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#bad_record"},"BAD_RECORD")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#bad_record_latent"},"BAD_RECORD_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#constant_address_dereference"},"CONSTANT_ADDRESS_DEREFERENCE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#constant_address_dereference_latent"},"CONSTANT_ADDRESS_DEREFERENCE_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#memory_leak"},"MEMORY_LEAK")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nil_block_call"},"NIL_BLOCK_CALL")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nil_block_call_latent"},"NIL_BLOCK_CALL_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nil_insertion_into_collection"},"NIL_INSERTION_INTO_COLLECTION")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nil_insertion_into_collection_latent"},"NIL_INSERTION_INTO_COLLECTION_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nil_messaging_to_non_pod"},"NIL_MESSAGING_TO_NON_POD")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nil_messaging_to_non_pod_latent"},"NIL_MESSAGING_TO_NON_POD_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_matching_branch_in_try"},"NO_MATCHING_BRANCH_IN_TRY")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_matching_branch_in_try_latent"},"NO_MATCHING_BRANCH_IN_TRY_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_matching_case_clause"},"NO_MATCHING_CASE_CLAUSE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_matching_case_clause_latent"},"NO_MATCHING_CASE_CLAUSE_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_matching_function_clause"},"NO_MATCHING_FUNCTION_CLAUSE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_matching_function_clause_latent"},"NO_MATCHING_FUNCTION_CLAUSE_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_match_of_rhs"},"NO_MATCH_OF_RHS")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_match_of_rhs_latent"},"NO_MATCH_OF_RHS_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_true_branch_in_if"},"NO_TRUE_BRANCH_IN_IF")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#no_true_branch_in_if_latent"},"NO_TRUE_BRANCH_IN_IF_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nullptr_dereference"},"NULLPTR_DEREFERENCE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#nullptr_dereference_latent"},"NULLPTR_DEREFERENCE_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#optional_empty_access"},"OPTIONAL_EMPTY_ACCESS")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#optional_empty_access_latent"},"OPTIONAL_EMPTY_ACCESS_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#pulse_uninitialized_value"},"PULSE_UNINITIALIZED_VALUE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#pulse_uninitialized_value_latent"},"PULSE_UNINITIALIZED_VALUE_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#pulse_unnecessary_copy"},"PULSE_UNNECESSARY_COPY")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#stack_variable_address_escape"},"STACK_VARIABLE_ADDRESS_ESCAPE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#use_after_delete"},"USE_AFTER_DELETE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#use_after_delete_latent"},"USE_AFTER_DELETE_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#use_after_free"},"USE_AFTER_FREE")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#use_after_free_latent"},"USE_AFTER_FREE_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#use_after_lifetime"},"USE_AFTER_LIFETIME")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#use_after_lifetime_latent"},"USE_AFTER_LIFETIME_LATENT")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#vector_invalidation"},"VECTOR_INVALIDATION")),Object(r.b)("li",{parentName:"ul"},Object(r.b)("a",{parentName:"li",href:"/docs/next/all-issue-types#vector_invalidation_latent"},"VECTOR_INVALIDATION_LATENT"))))}p.isMDXComponent=!0},254:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return N}));var a=n(0),l=n.n(a);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var o=l.a.createContext({}),p=function(e){var t=l.a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return l.a.createElement(o.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return l.a.createElement(l.a.Fragment,{},t)}},d=l.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,o=c(e,["components","mdxType","originalType","parentName"]),u=p(n),d=a,N=u["".concat(s,".").concat(d)]||u[d]||b[d]||r;return n?l.a.createElement(N,i(i({ref:t},o),{},{components:n})):l.a.createElement(N,i({ref:t},o))}));function N(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,s=new Array(r);s[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var o=2;o<r;o++)s[o]=n[o];return l.a.createElement.apply(null,s)}return l.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);