const test = require('ava');
const classy = require('./index.js');

test('Classification null/undefined args test', (t) => {
  t.false(classy.classEqOrMoreSecureThan(null, null))
  t.false(classy.classEqOrMoreSecureThan(null,'CLASS2'))
  t.false(classy.classEqOrMoreSecureThan('CLASS1',null))
  t.false(classy.classEqOrMoreSecureThan(undefined, undefined))
  t.false(classy.classEqOrMoreSecureThan(undefined,'CLASS2'))
  t.false(classy.classEqOrMoreSecureThan('CLASS1',undefined))
})

test('Classification not string type test', (t) => {
  t.false(classy.classEqOrMoreSecureThan(1, 2))
  t.false(classy.classEqOrMoreSecureThan([], []))
  t.false(classy.classEqOrMoreSecureThan('UNCLASSIFIED', 1))
  t.false(classy.classEqOrMoreSecureThan(2, 'UNCLASSIFIED'))
  t.false(classy.classEqOrMoreSecureThan('UNCLASSIFIED', []))
  t.false(classy.classEqOrMoreSecureThan([], 'UNCLASSIFIED'))
})

test('Classification type test', (t) => {
  t.true(classy.classEqOrMoreSecureThan('UNCLASSIFIED', 'UNCLASSIFIED'))
  t.true(classy.classEqOrMoreSecureThan('CONFIDENTIAL', 'CONFIDENTIAL'))
  t.true(classy.classEqOrMoreSecureThan('SECRET', 'SECRET'))
  t.true(classy.classEqOrMoreSecureThan('TOP SECRET', 'TOP SECRET'))

  t.true(classy.classEqOrMoreSecureThan('TOP SECRET', 'UNCLASSIFIED'))
  t.true(classy.classEqOrMoreSecureThan('TOP SECRET', 'CONFIDENTIAL'))
  t.true(classy.classEqOrMoreSecureThan('TOP SECRET', 'SECRET'))
  t.true(classy.classEqOrMoreSecureThan('SECRET', 'UNCLASSIFIED'))
  t.true(classy.classEqOrMoreSecureThan('SECRET', 'CONFIDENTIAL'))
  t.true(classy.classEqOrMoreSecureThan('CONFIDENTIAL', 'UNCLASSIFIED'))

  t.false(classy.classEqOrMoreSecureThan('UNCLASSIFIED', 'TOP SECRET'))
  t.false(classy.classEqOrMoreSecureThan('CONFIDENTIAL', 'TOP SECRET'))
  t.false(classy.classEqOrMoreSecureThan('SECRET', 'TOP SECRET'))
  t.false(classy.classEqOrMoreSecureThan('UNCLASSIFIED', 'SECRET'))
  t.false(classy.classEqOrMoreSecureThan('CONFIDENTIAL', 'SECRET'))
  t.false(classy.classEqOrMoreSecureThan('UNCLASSIFIED', 'CONFIDENTIAL'))
})


test('SCI simple test', (t) => {
  t.true(classy.sciEqOrMoreSecureThan('TAL', 'TAL'))
  t.true(classy.sciEqOrMoreSecureThan('tal', 'tal'))
  t.true(classy.sciEqOrMoreSecureThan('tal kh', 'tal kh'))
  t.true(classy.sciEqOrMoreSecureThan('tal kh/sc', 'tal kh/sc'))
  t.true(classy.sciEqOrMoreSecureThan('sc-d', 'sc-d'))
  t.true(classy.sciEqOrMoreSecureThan('sc-d f', 'sc-d f'))
  t.true(classy.sciEqOrMoreSecureThan('tal k/sc-d f', 'tal k/sc-d f'))
  t.true(classy.sciEqOrMoreSecureThan('tal k/sc-d f/bb', 'tal k/sc-d f/bb'))
})

test('SCI comparison test', (t) => {
  t.true(classy.sciEqOrMoreSecureThan('TAL', 'TAL'))
  t.true(classy.sciEqOrMoreSecureThan('TAL/SC', 'TAL/SC'))
  t.true(classy.sciEqOrMoreSecureThan('TAL/SC', 'TAL'))
  t.true(classy.sciEqOrMoreSecureThan('TAL/SC', 'SC'))
  t.true(classy.sciEqOrMoreSecureThan('TAL/SC-D', 'SC-D'))
  t.true(classy.sciEqOrMoreSecureThan('TAL/SC-B', 'TAL'))
  t.true(classy.sciEqOrMoreSecureThan('TAL/SC-B D F', 'SC-B'))
  t.false(classy.sciEqOrMoreSecureThan('SC-B D F', 'TAL/SC-B'))
  t.false(classy.sciEqOrMoreSecureThan('SC', 'SC-B'))
  t.false(classy.sciEqOrMoreSecureThan('TAL', 'SC'))
})

test('Separate SCI\'s', (t) => {
  let returnedScis

  returnedScis = classy.explodeScis(['AAA'])
  t.true(returnedScis.length == 1 && returnedScis[0] === 'AAA')
  returnedScis = classy.explodeScis(['SI-D AB CD'])
  t.true(returnedScis.length == 4)
  t.true(returnedScis.indexOf('SI') > -1)
  t.true(returnedScis.indexOf('SI-D') > -1)
  t.true(returnedScis.indexOf('SI-D AB') > -1)
  t.true(returnedScis.indexOf('SI-D CD') > -1)

  returnedScis = classy.explodeScis(['HCS','KDK-AAA 123-LLL SSS','MMM-XYZ','SI-G QURT-PPP','TK'])

  t.true(returnedScis.length === 13)
  t.true(returnedScis.indexOf('HCS') > -1)
  t.true(returnedScis.indexOf('KDK') > -1)
  t.true(returnedScis.indexOf('KDK-AAA') > -1)
  t.true(returnedScis.indexOf('KDK-AAA 123') > -1)
  t.true(returnedScis.indexOf('KDK-LLL') > -1)
  t.true(returnedScis.indexOf('KDK-LLL SSS') > -1)
  t.true(returnedScis.indexOf('MMM') > -1)
  t.true(returnedScis.indexOf('MMM-XYZ') > -1)
  t.true(returnedScis.indexOf('SI') > -1)
  t.true(returnedScis.indexOf('SI-G') > -1)
  t.true(returnedScis.indexOf('SI-G QURT') > -1)
  t.true(returnedScis.indexOf('SI-PPP') > -1)
  t.true(returnedScis.indexOf('TK') > -1)
})

test('Head/tail tests', (t) => {
  let sci
  let headTail

  sci = ''
  headTail = classy.headTail(sci, '-')
  t.true(headTail.head === '')
  t.true(headTail.tail.length === 0)

  sci = 'HCS'
  headTail = classy.headTail(sci, '-')
  t.true(headTail.head === 'HCS')
  t.true(headTail.tail.length === 0)

  sci = 'KDK-AAA'
  headTail = classy.headTail(sci, '-')
  t.true(headTail.head === 'KDK')
  t.true(headTail.tail.length === 1)
  t.true(headTail.tail[0] === 'AAA')

  sci = 'KDK-AAA 123'
  headTail = classy.headTail(sci, '-')
  t.true(headTail.head === 'KDK')
  t.true(headTail.tail.length === 1)
  t.true(headTail.tail[0] === 'AAA 123')

  sci = 'KDK-AAA 123-LLL SSS'
  headTail = classy.headTail(sci, '-')
  t.true(headTail.head === 'KDK')
  t.true(headTail.tail.length === 2)
  t.true(headTail.tail[0] === 'AAA 123')
  t.true(headTail.tail[1] === 'LLL SSS')

  sci = 'SI-D AB CD'
  headTail = classy.headTail(sci, '-')
  t.true(headTail.head === 'SI')
})

test('Scrape out nf/rel to', (t) => {
  let result
  result = classy.scrapeOutNfRelto(['NOFORN'])
  t.true(result.length === 1)
  t.true(result[0] === 'NOFORN')
  result = classy.scrapeOutNfRelto(['REL TO USA, GBR'])
  t.true(result.length == 2)
  t.true(result.indexOf('REL TO USA') > -1)
  t.true(result.indexOf('REL TO GBR') > -1)
  result = classy.scrapeOutNfRelto([])
  t.true(result.length === 0)
  result = classy.scrapeOutNfRelto(['NOFORN','REL TO USA, GBR'])
  t.true(result.length === 1)
  t.true(result[0] === 'NOFORN')
  result = classy.scrapeOutNfRelto(['REL TO USA, GBR','NOFORN'])
  t.true(result.length === 1)
  t.true(result[0] === 'NOFORN')
  result = classy.scrapeOutNfRelto(['REL TO USA, GBR, CAN, NZL'])
  t.true(result.indexOf('REL TO USA') > -1)
  t.true(result.indexOf('REL TO GBR') > -1)
  t.true(result.indexOf('REL TO CAN') > -1)
  t.true(result.indexOf('REL TO NZL') > -1)
})

test('Rel To tests', (t) => {
  t.true(classy.reltoEqOrMoreSecureThan(['NOFORN'], ['NOFORN']))
  t.true(classy.reltoEqOrMoreSecureThan(['REL TO USA'],['REL TO USA']))
  t.true(classy.reltoEqOrMoreSecureThan(['NOFORN'], ['REL TO USA']))
  t.true(classy.reltoEqOrMoreSecureThan(['REL TO USA'],['REL TO USA','REL TO GBR']))
  t.false(classy.reltoEqOrMoreSecureThan(['REL TO USA','REL TO GBR'],['REL TO USA']))
  t.true(classy.reltoEqOrMoreSecureThan(['REL TO USA'],[]))
  t.false(classy.reltoEqOrMoreSecureThan([],['REL TO USA']))
  t.true(classy.reltoEqOrMoreSecureThan([],[]))
})

test('Dissemination test', (t) => {
  t.true(classy.dissemEqOrMoreSecureThan('', ''))
  t.true(classy.dissemEqOrMoreSecureThan('NOFORN', 'noforn'))
  t.false(classy.dissemEqOrMoreSecureThan('noforn', 'NOFORN'))
  t.true(classy.dissemEqOrMoreSecureThan('NOFORN', 'NOFORN'))
  t.false(classy.dissemEqOrMoreSecureThan('RELIDO', 'NOFORN'))
  t.true(classy.dissemEqOrMoreSecureThan('NOFORN', 'RELIDO'))
  t.true(classy.dissemEqOrMoreSecureThan('REL TO USA, AUS, CAN, GBR, NZL', 'REL TO USA, AUS, CAN, GBR, NZL'))
  t.true(classy.dissemEqOrMoreSecureThan('REL TO USA, GBR', 'REL TO USA, GBR'))
  t.true(classy.dissemEqOrMoreSecureThan('NOFORN', 'REL TO USA, AUS, CAN, GBR, NZL'))
  t.true(classy.dissemEqOrMoreSecureThan('NOFORN', 'REL TO USA, GBR'))
  t.false(classy.dissemEqOrMoreSecureThan('REL TO USA, GBR', 'NOFORN'))
  t.false(classy.dissemEqOrMoreSecureThan('REL TO USA, AUS, CAN, GBR, NZL', 'NOFORN'))
  t.false(classy.dissemEqOrMoreSecureThan('REL TO USA, AUS, CAN, GBR, NZL', 'REL TO USA, GBR'))
  t.true(classy.dissemEqOrMoreSecureThan('REL TO USA, GBR', 'REL TO USA, AUS, CAN, GBR, NZL'))
  t.false(classy.dissemEqOrMoreSecureThan('REL TO USA,AUS,CAN,GBR,NZL', 'REL TO USA,GBR'))
  t.true(classy.dissemEqOrMoreSecureThan('REL TO USA,GBR', 'REL TO USA,AUS,CAN,GBR,NZL'))
})

test('Simple banner tests', (t) => {
  t.true(classy.bannerEqOrMoreSecureThan('UNCLASSIFIED', 'UNCLASSIFIED'))
  t.true(classy.bannerEqOrMoreSecureThan('UNCLASSIFIED//FOUO', 'UNCLASSIFIED'))
  t.false(classy.bannerEqOrMoreSecureThan('UNCLASSIFIED', 'UNCLASSIFIED//FOUO'))
  t.true(classy.bannerEqOrMoreSecureThan('SECRET', 'CONFIDENTIAL'))
})

test('Banner and relto tests', (t) => {
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA', 'Unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, GBR', 'Unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, AUS, CAN, GBR, NZL', 'Unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA,AUS,CAN,GBR,NZL', 'Unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA', 'TOP SECRET//REL TO USA'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, GBR', 'TOP SECRET//REL TO USA, GBR'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA', 'TOP SECRET//REL TO USA, GBR'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, GBR', 'TOP SECRET//REL TO USA'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, GBR', 'TOP SECRET//REL TO USA, AUS, CAN, GBR, NZL'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, AUS, CAN, GBR, NZL', 'TOP SECRET//REL TO USA, GBR'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, AUS, CAN, GBR, NZL', 'Unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA,AUS,CAN,GBR,NZL', 'Unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, GBR, CAN, NZL, AUS', 'Unclassified'))
})

test('Banner, simple SCIs and dissem tests', (t) => {
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//SI//REL TO USA', 'UNCLASSIFIED'))
  t.false(classy.bannerEqOrMoreSecureThan('UNCLASSIFIED', 'TOP SECRET//SI//REL TO USA'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//SI//REL TO USA, GBR', 'TOP SECRET//REL TO USA, GBR'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, GBR', 'TOP SECRET//SI//REL TO USA, GBR'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//SI//NOFORN', 'TOP SECRET//REL TO USA, GBR'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//SI//REL TO USA, GBR', 'TOP SECRET//NOFORN'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//NOFORN', 'TOP SECRET//SI//REL TO USA, GBR'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, GBR', 'TOP SECRET//SI//NOFORN'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//SI//NOFORN', 'TOP SECRET//REL TO USA, AUS, CAN, GBR, NZL'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//SI//REL TO USA, AUS, CAN, GBR, NZL', 'TOP SECRET//NOFORN'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//NOFORN', 'TOP SECRET//SI//REL TO USA, AUS, CAN, GBR, NZL'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//REL TO USA, AUS, CAN, GBR, NZL', 'TOP SECRET//SI//NOFORN'))
})

test('Banner and complex SCIs tests', (t) => {
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'TOP SECRET'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'TOP SECRET//HCS/KDK-LLL SSS/MMM-XYZ/SI-G-PPP/TK'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'TOP SECRET'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'TOP SECRET//HCS'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'SECRET//HCS'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET', 'SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK'))
})

test('Banner, complex SCIs and dissem tests', (t) => {
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'TOP SECRET//NOFORN'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'TOP SECRET//HCS//NOFORN'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK//NOFORN', 'TOP SECRET//HCS//NOFORN'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK//NOFORN', 'TOP SECRET//HCS//REL TO USA, GBR'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK//REL TO USA, GBR', 'TOP SECRET//HCS//NOFORN'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK//REL TO USA, GBR', 'TOP SECRET//HCS//REL TO USA, AUS, CAN, GBR, NZL'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK//REL TO USA, AUS, CAN, GBR, NZL', 'TOP SECRET//HCS//REL TO USA, GBR'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET', 'SECRET//NOFORN'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'SECRET//NOFORN'))
  t.false(classy.bannerEqOrMoreSecureThan('TOP SECRET//HCS/KDK-AAA 123-LLL SSS/MMM-XYZ/SI-G QURT-PPP/TK', 'SECRET//HCS//NOFORN'))
})

test('Banner tests with upper/lower cases', (t) => {
  t.true(classy.bannerEqOrMoreSecureThan('UNCLASSIFIED', 'unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('confidential', 'CONFIDENTIAL'))
  t.true(classy.bannerEqOrMoreSecureThan('SECRET', 'Secret'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET', 'top SEcret'))
  t.true(classy.bannerEqOrMoreSecureThan('UNCLASSIFIED', 'unclassified'))
  t.true(classy.bannerEqOrMoreSecureThan('confidential', 'CONFIDENTIAL'))
  t.true(classy.bannerEqOrMoreSecureThan('SECRET', 'Secret'))
  t.true(classy.bannerEqOrMoreSecureThan('TOP SECRET', 'top SEcret'))
})
