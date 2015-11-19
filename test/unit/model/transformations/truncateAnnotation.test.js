'use strict';
require('../../qunit_extensions');

var containerAnnoSample = require('../../../fixtures/container_anno_sample');
var truncateAnnotation = require('../../../../model/transform/truncateAnnotation');

QUnit.module('model/transform/truncateAnnotation');

QUnit.test("Truncate property annotation for a given property selection", function(assert) {
  var doc = containerAnnoSample();

  // a2: strong -> p1.content [0..2]
  assert.ok(doc.get('a2'), 'Should have a strong annotation a2 in fixture');

  // Put cursor inside an the existing annotation
  var sel = doc.createSelection({
    type: 'property',
    path: ['p1', 'content'],
    startOffset: 1,
    endOffset: 2
  });

  // Prepare and perform transformation
  var args = {selection: sel, containerId: 'main', annotationType: 'strong'};
  var out = truncateAnnotation(doc, args);
  var a2 = out.result;

  assert.ok(a2, 'a2', 'a2 should have been returned as a result');
  assert.equal(a2.startOffset, 0, 'a2.startOffset should be 0');
  assert.equal(a2.endOffset, 1, 'a2.endOffset should have changed from 2 to 1');
});

QUnit.test("Truncate container annotation for a given property selection", function(assert) {
  var doc = containerAnnoSample();

  assert.ok(doc.get('a1'), 'Should have a container annotation a1 in fixture');
  var sel = doc.createSelection({
    type: 'property',
    path: ['p3', 'content'],
    startOffset: 1,
    endOffset: 4
  });

  // Prepare and perform transformation
  var args = {selection: sel, containerId: 'main', annotationType: 'test-container-anno'};
  var out = truncateAnnotation(doc, args);
  var a1 = out.result;

  assert.ok(a1, 'a1', 'a1 should have been returned as a result');
  assert.equal(a1.endOffset, 1, 'a1.endOffset should be 1');
});

QUnit.test("Truncate container annotation for a given container selection", function(assert) {
  var doc = containerAnnoSample();

  assert.ok(doc.get('a1'), 'Should have a container annotation a1 in fixture');
  var sel = doc.createSelection({
    type: 'container',
    containerId: 'main',
    startPath: ['p2', 'content'],
    startOffset: 1,
    endPath: ['p3', 'content'],
    endOffset: 4,
  });

  // Prepare and perform transformation
  var args = {selection: sel, containerId: 'main', annotationType: 'test-container-anno'};
  var out = truncateAnnotation(doc, args);
  var a1 = out.result;

  assert.ok(a1, 'a1', 'a1 should have been returned as a result');
  assert.deepEqual(a1.endPath, ['p2', 'content'], 'a1.endPath should be p2.content');
  assert.equal(a1.endOffset, 1, 'a1.endOffset should be 1');
});
