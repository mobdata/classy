function bannerEqOrMoreSecureThan (b1, b2) {
  const splits1 = b1.toUpperCase().split('//')
  const splits2 = b2.toUpperCase().split('//')
  const RELTO = 'REL TO'
  const NOFORN = 'NOFORN'
  const ORCON = 'ORCON'
  const RELIDO = 'RELIDO'

  if (splits1.length > 1 && (splits1[1].indexOf(RELTO) > -1 ||
        splits1[1].indexOf(NOFORN) > -1 ||
        splits1[1].indexOf(ORCON) > -1 ||
        splits1[1].indexOf(RELIDO)) > -1) {
    splits1.splice(1, 0, '')
  }
  if (splits2.length > 1 && (splits2[1].indexOf(RELTO) > -1 ||
        splits2[1].indexOf(NOFORN) > -1 ||
        splits2[1].indexOf(ORCON) > -1 ||
        splits2[1].indexOf(RELIDO) > -1)) {
    splits2.splice(1, 0, '')
  }

  if (classEqOrMoreSecureThan(splits1[0], splits2[0])) {
    const scis1 = splits1[1]
    const scis2 = splits2[1]
    const disseminations1 = splits1[2]
    const disseminations2 = splits2[2]

    if (sciEqOrMoreSecureThan(scis1, scis2) && dissemEqOrMoreSecureThan(disseminations1, disseminations2)) {
      return true
    } else {
      return false
    }
  }

  return false
}

function classEqOrMoreSecureThan (c1, c2) {
  const UNCLASSIFIED = 'UNCLASSIFIED'
  const CONFIDENTIAL = 'CONFIDENTIAL'
  const SECRET = 'SECRET'
  const TOP_SECRET = 'TOP SECRET'
  const classifications = [UNCLASSIFIED, CONFIDENTIAL, SECRET, TOP_SECRET]

  const re = /^(UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET)$/i
  if (!re.test(c1) || !re.test(c2)) {
    return false
  }

  if (classifications.indexOf(c1) === -1 || classifications.indexOf(c2) === -1) {
    return false
  }

  if (classifications.indexOf(c1) >= classifications.indexOf(c2)) {
    return true
  } else {
    return false
  }
}

function sciEqOrMoreSecureThan (sci1, sci2) {
  const validChars = /[0-9A-z -\\/]*/
  if (!validChars.test(sci1) || !validChars.test(sci2)) {
    return false
  }

  if (typeof sci1 === 'undefined' || sci1 === null) {
    sci1 = ''
  }
  if (typeof sci2 === 'undefined' || sci2 === null) {
    sci2 = ''
  }

  if (sci1 === sci2) {
    return true
  }

  if (sci1.length === 0) {
    return false
  } else if (sci2.length === 0) {
    return true
  }

  const scis1 = explodeScis(sci1.split('/'))
  const scis2 = explodeScis(sci2.split('/'))

  return scis2.every(function (val) {
    return scis1.indexOf(val) >= 0
  })
}

function explodeScis (scis) {
  const explodedScis = []

  const reducedScis = scis.filter(function (val) {
    const sciLabelAndCompartments = headTail(val, '-')
    if (sciLabelAndCompartments.tail.length > 0) {
      explodedScis.push(sciLabelAndCompartments.head)
      sciLabelAndCompartments.tail.forEach(function (compartment) {
        const compLabelAndSubs = headTail(compartment, ' ')
        explodedScis.push(sciLabelAndCompartments.head + '-' + compLabelAndSubs.head)
        compLabelAndSubs.tail.forEach(function (sub) {
          if (compLabelAndSubs.tail.length > 0) {
            explodedScis.push(sciLabelAndCompartments.head + '-' + compLabelAndSubs.head + ' ' + sub)
          }
        })
      })
      return false
    }
    return true
  })

  explodedScis.forEach(function (sci) {
    reducedScis.push(sci)
  })

  return reducedScis
}

function headTail (value, separator) {
  const headAndTail = {}
  const splitArray = value.split(separator)
  headAndTail.head = splitArray[0]
  headAndTail.tail = splitArray.slice(1)
  return headAndTail
}

function scrapeOutNfRelto (dissemsArray) {
  const finalDissems = []
  if (dissemsArray.indexOf('NOFORN') > -1) {
    finalDissems.push('NOFORN')
  } else {
    const tempDissems = dissemsArray.filter(function (val) {
      if (val.indexOf('REL TO') === 0) {
        return true
      }
      return false
    })
    tempDissems.forEach(function (val) {
      val.substring(7).split(',').forEach(function (release) {
        finalDissems.push('REL TO ' + release.trim())
      })
    })
  }

  return finalDissems
}

function reltoEqOrMoreSecureThan (nfreltoArray1, nfreltoArray2) {
  if (nfreltoArray2.length === 0) {
    return true
  }
  if (nfreltoArray1.length === 0) {
    return false
  }

  if (nfreltoArray1.indexOf('NOFORN') > -1) {
    return true
  }

  if (nfreltoArray2.indexOf('NOFORN') > -1) {
    return false
  }

  if (nfreltoArray1.length <= nfreltoArray2.length) {
    const filteredArray = nfreltoArray1.filter(function (val) {
      return nfreltoArray2.indexOf(val) > -1
    })
    if (filteredArray.length === nfreltoArray1.length) {
      return true
    }
  }

  return false
}

function dissemEqOrMoreSecureThan (dissemStr1, dissemStr2) {
  const validChars = /[A-z -\\/]*/

  if (!validChars.test(dissemStr1) || !validChars.test(dissemStr2)) {
    return false
  }

  if (typeof dissemStr1 === 'undefined' || dissemStr1 === null) {
    dissemStr1 = ''
  }
  if (typeof dissemStr2 === 'undefined' || dissemStr2 === null) {
    dissemStr2 = ''
  }
  if (dissemStr1 === dissemStr2) {
    return true
  }
  if (dissemStr2 === '') {
    return true
  }

  const dissems1 = dissemStr1.split('/')
  const dissems2 = dissemStr2.split('/')
  const nfrelto1 = scrapeOutNfRelto(dissems1)
  const nfrelto2 = scrapeOutNfRelto(dissems2)

  if (nfrelto1.indexOf('NOFORN') > -1) {
    return true
  }
  if (nfrelto2.indexOf('NOFORN') > -1) {
    return false
  }

  if (!reltoEqOrMoreSecureThan(nfrelto1, nfrelto2)) {
    return false
  }

  return true
}

module.exports = {
  bannerEqOrMoreSecureThan: bannerEqOrMoreSecureThan,
  classEqOrMoreSecureThan: classEqOrMoreSecureThan,
  sciEqOrMoreSecureThan: sciEqOrMoreSecureThan,
  explodeScis: explodeScis,
  headTail: headTail,
  scrapeOutNfRelto: scrapeOutNfRelto,
  reltoEqOrMoreSecureThan: reltoEqOrMoreSecureThan,
  dissemEqOrMoreSecureThan: dissemEqOrMoreSecureThan
}
