# classy
Module for comparing intelligence community classifications.

## Install


Testing

````bash
npm install --save '@mobdata/classy'
````

## Usage

The module exports several functions which makes testing them easier but most everyone will only
need one, the `bannerEqOrMoreSecureThan`.

Given two classification strings, or "banners", this function returns `true` when the first banner
is at least secure as the second banner.

In a prototypical example, you have a document classified as "SECRET" and person X has asked to
see it. Person X's clearance gives them access to "CONFIDENTIAL" information. In this case, Person
X does not have the clearance to view the document! Their clearance is not "equal or more secure
than" the document's classification.


````js
import { bannerEqOrMoreSecureThan } from '@mobdata/classy';

var document = 'SECRET';
var personX = 'CONFIDENTIAL';

if (bannerEqOrMoreSecureThan(document, personX) === true) {
  // do something cool
} else {
  // don't let personX see it!
}
````

Additional notes about `bannerEqOrMoreSecureThan`:

* The parameters are case-insensitive.
* The parameters may be of arbitrary complexity.
* The parameters may be any accepted banner line marking found in the "Marking of Classified
  Information" manual 5200.01, Volume 2 for the DoD.
* This includes classifications, disseminations and any number of sci's.
* Abbreviations such as found in portion markings, `S//REL`, `C//FRD`, etc, are _not_ supported.
* Not supported: non-U.S. documents markings, joint classification markings, Atomic Energy Act
  markings.

Mobdata is a project under Jacobs
