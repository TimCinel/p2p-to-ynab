p2p to YNAB
===========

*Keep track of your RateSetter transactions in YNAB with this CSV conversion tool*

Usage Instructions
------------------

1. Run `./scripts/generate.sh`
2. Open the generated HTML files in your browser
3. Follow the your nose through the UI

Alternatively, you can use the conversion tools from my site:

* [RateSetter CSV to YNAB CSV](https://www.timcinel.com/public/ratesetter_ynab.html)
* [ThinCats CSV to YNAB CSV](https://www.timcinel.com/public/thincats_ynab.html)
* [TruePillars CSV to YNAB CSV](https://www.timcinel.com/public/truepillars_ynab.html)

Adding a Platform
-----------------

1. Look at `ratesetter.js`, `thincats.js`, and/or `truepillars.js`
2. Look at `config/ratesetter.vars`, `config/thincats.vars`, and/or `config/truepillars.vars`
3. Look at the commit 187bcdfa
4. Copy, raise a PR.

Credits
-------

Created by [Tim Cinel](https://www.timcinel.com/)

License
-------

The MIT License
