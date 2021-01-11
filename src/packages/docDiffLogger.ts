import cloneDeep from 'clonedeep';
import {diff} from 'objectdiff';
import {Package} from '../Package';

let firstDocs, startDocs, endDocs, lastDocs;
const options = {
  start: null,
  end: null
};

export const docDiffLoggerPackage = new Package('docDiffLogger')

.factory('docDiffLoggerOptions', function() {
  return options;
})

.eventHandler('processorStart', function() {
  return function capturePreviousDocs(event, processor, docs) {
    firstDocs = firstDocs || cloneDeep(docs);

    if ( options.start === processor.name ) {
      startDocs = cloneDeep(docs);
    }
  };
})

.eventHandler('processorEnd', function(log) {
  return function(_event, processor, docs) {
    lastDocs = docs;

    if ( options.end === processor.name ) {
      endDocs = cloneDeep(docs);
      logDiff(log);
    }
  };
})

.eventHandler('generationEnd', function(log) {
  return function() {
    if ( options.start && !startDocs ) {
      throw new Error('docDiffLogger: missing start processor');
    }
    if ( options.end && !endDocs ) {
      throw new Error('docDiffLogger: missing end processor');
    }
    if ( !options.end ) {
      logDiff(log);
    }
  };
});


function logDiff(log) {
  const changes = diff(startDocs || firstDocs, endDocs || lastDocs);
  log.info(options);
  log.info(changes);
}