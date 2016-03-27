/**
 * Importer
 *
 * @author tobiasb
 * @since 2016
 */

export default class Typo3 {

  static convertDate(timestamp) {
    return new Date(timestamp*1000);
  }
}
