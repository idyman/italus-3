-- Migration: Add the hardcoded CV sections to cv_custom_sections table
-- This makes "Automotive Experience", "Software", and "Additional Experience" editable in the admin
-- Run this in your Supabase SQL Editor AFTER running supabase-migration-cv-custom-sections.sql

-- Insert Automotive Experience section
INSERT INTO cv_custom_sections (section_id, section_name, content, order_index, enabled)
VALUES (
  'automotive',
  'Automotive, Transportation Design Experience',
  '<div class="space-y-8">
    <div class="pb-6 border-b border-gray-200">
      <p class="font-semibold text-gray-900">Green Ride, Haifa</p>
      <p class="italic text-gray-700 mb-2">Creative Director, Head Designer, 2012 to 2014</p>
      <p class="text-gray-600 mb-3">Automotive startup</p>
      <ul class="space-y-1 text-gray-700">
        <li>• Led design team, concept ideation to development, transportation design, UX UI, GUI, graphic design</li>
      </ul>
    </div>
    <div class="pb-6 border-b border-gray-200">
      <p class="font-semibold text-gray-900">Fiat Chrysler Automobiles, Turin</p>
      <p class="italic text-gray-700 mb-2">Exterior Designer, 2007</p>
      <ul class="space-y-1 text-gray-700">
        <li>• Concept car program, under Roberto Giolito, Fiat Centro Stile</li>
      </ul>
    </div>
    <div class="pb-6 border-b border-gray-200">
      <p class="font-semibold text-gray-900">Alfa Romeo, Arese</p>
      <p class="italic text-gray-700 mb-2">Interior Designer, 2007</p>
      <ul class="space-y-1 text-gray-700">
        <li>• Color and trim, under head designers Favilla, Maccolini</li>
      </ul>
    </div>
    <div>
      <p class="font-semibold text-gray-900">Audi, Milan</p>
      <p class="italic text-gray-700 mb-2">Exterior Designer, 2006 to 2007</p>
      <ul class="space-y-1 text-gray-700">
        <li>• A6 Avant 2015 program, under Walter de Silva, Audi Group</li>
      </ul>
    </div>
  </div>',
  0,
  true
)
ON CONFLICT (section_id) DO UPDATE SET
  section_name = EXCLUDED.section_name,
  content = EXCLUDED.content,
  enabled = EXCLUDED.enabled;

-- Insert Software section
INSERT INTO cv_custom_sections (section_id, section_name, content, order_index, enabled)
VALUES (
  'software',
  'Software',
  '<ul class="space-y-1 text-gray-700">
    <li>Adobe CC, Photoshop, Illustrator, InDesign</li>
    <li>Premiere Pro</li>
    <li>Figma, XD, Sketch, InVision</li>
    <li>Autodesk Alias, SketchUp, Vray</li>
    <li>Microsoft 365, WordPress, Elementor</li>
  </ul>',
  1,
  true
)
ON CONFLICT (section_id) DO UPDATE SET
  section_name = EXCLUDED.section_name,
  content = EXCLUDED.content,
  enabled = EXCLUDED.enabled;

-- Insert Additional Experience section
INSERT INTO cv_custom_sections (section_id, section_name, content, order_index, enabled)
VALUES (
  'additional',
  'Additional Experience',
  '<div class="space-y-4 text-gray-700">
    <p>Le Cordon Bleu, Boston, Chef du cuisine, 2005, plus four years in top restaurants in Israel, USA, Italy</p>
    <p>Professional Lifeguard, Israel, 2004</p>
    <p>IDF, Israel Defence Forces, Combat soldier, Commander, 1994 to 1997</p>
  </div>',
  2,
  true
)
ON CONFLICT (section_id) DO UPDATE SET
  section_name = EXCLUDED.section_name,
  content = EXCLUDED.content,
  enabled = EXCLUDED.enabled;
