# postcss-query-ast

[![Build Status][ci-img]][ci]

Query PostCSS AST with CSS selectors.

Supported selectors are:

* [Type selectors][mdn-type-selector]: `rule`, `atrule`, `decl`, `comment`
* [Universal selector](mdn-universal-selector): `*`
* [Attribute selectors][mdn-attribute-selector]: `[attr=value]`, `[attr=value]`, `[attr~=value]`, `[attr|=value]`, `[attr^=value]`, `[attr$=value]`, `[attr*=value]`
* [Descendant combinator][mdn-descendant-combinator]: `rule decl`
* [Child combinator][mdn-child-combinator]: `atrule > rule`
* [Adjacent sibling combinator][mdn-adjacent-sibling-combinator]: `rule + rule`
* [General sibling combinator][mdn-general-sibling-combinator]: `rule ~ rule`
* Child pseudo classes ([`:first-child`][mdn-first-child], [`:last-child`][mdn-last-child], [`:nth-child`][mdn-nth-child], [`:nth-last-child`][mdn-nth-last-child], [`:only-child`][mdn-only-child]): `rule:first-child`
* Type pseudo classes ([`:first-of-type`][mdn-first-of-type], [`:last-of-type`][mdn-last-of-type], [`:nth-of-type`][mdn-nth-of-type], [`:nth-last-of-type`][mdn-nth-last-of-type], [`:only-of-type`][mdn-only-of-type]): `rule:first-of-type`
* [Empty nodes][mdn-empty]: `rule:empty`
* [Matches][mdn-matches]: `:matches(rule, atrule)`
* [Negation][mdn-not]: `:not(atrule)`

In addition to standard selectors, there are also custom selectors:

* Attribute selector with regular expression: `[attr="/^value$/i"]`

## Install

```sh
npm install postcss-query-ast --save
```

## Usage

```js
import queryAst from 'postcss-query-ast';

queryAst('rule[selector="body"]').then(( ast ) => {
	/* [ Rule {
	    raws: { before: '\n\t', between: ' ', semicolon: true, after: '\n\t' },
	    type: 'rule',
	    nodes: [ [Object] ],
	    parent: 
	     AtRule { ... },
	    source: { start: [Object], input: [Object], end: [Object] },
	    selector: 'body',
	    lastEach: 11,
	    indexes: {} } ] */
});
```

## API

### queryAst(query, ast)

Returns: `Promise`

Queries PostCSS with CSS selector.

#### query

Type: `String`

CSS selector.

#### ast

Type: `PostCSS.Node`

PostCSS AST.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.com/niksy/postcss-query-ast
[ci-img]: https://travis-ci.com/niksy/postcss-query-ast.svg?branch=master
[mdn-type-selector]: https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors
[mdn-universal-selector]: https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors
[mdn-attribute-selector]: https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
[mdn-descendant-combinator]: https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors
[mdn-child-combinator]: https://developer.mozilla.org/en-US/docs/Web/CSS/Child_selectors
[mdn-adjacent-sibling-combinator]: https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_selectors
[mdn-general-sibling-combinator]: https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_selectors
[mdn-first-child]: https://developer.mozilla.org/en-US/docs/Web/CSS/:first-child
[mdn-last-child]: https://developer.mozilla.org/en-US/docs/Web/CSS/:last-child
[mdn-nth-child]: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child
[mdn-nth-last-child]: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-last-child
[mdn-only-child]: https://developer.mozilla.org/en-US/docs/Web/CSS/:only-child
[mdn-first-of-type]: https://developer.mozilla.org/en-US/docs/Web/CSS/:first-of-type
[mdn-last-of-type]: https://developer.mozilla.org/en-US/docs/Web/CSS/:last-of-type
[mdn-nth-of-type]: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-of-type
[mdn-nth-last-of-type]: https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-last-of-type
[mdn-only-of-type]: https://developer.mozilla.org/en-US/docs/Web/CSS/:only-of-type
[mdn-empty]: https://developer.mozilla.org/en-US/docs/Web/CSS/:empty
[mdn-matches]: https://developer.mozilla.org/en-US/docs/Web/CSS/:matches
[mdn-not]: https://developer.mozilla.org/en-US/docs/Web/CSS/:not
