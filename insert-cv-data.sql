-- Insert CV Profile
INSERT INTO cv_profile (name, location, phone, email, nationality, date_of_birth, positioning_summary, core_strengths)
VALUES (
  'Itamar-David Yannay',
  'Henstedt Ulzburg, Germany, Tel Aviv, Israel',
  '+972 (0)54 6499011',
  'itamardesign@gmail.com',
  'Portuguese, Israeli',
  '25 Aug 1976',
  'Senior brand and creative leader with international B2C and B2B experience across advertising, SaaS, and product led companies. I build brands that people understand fast, trust quickly, and choose repeatedly, across messaging, visual identity, campaigns, and digital experiences. I lead concept, direction, and execution end to end, align stakeholders, translate strategy into systems, and ship work that holds up in the real world, not just in presentations.',
  ARRAY[
    'Brand strategy translation into identity systems, messaging, and campaign platforms',
    'Creative direction for cross channel campaigns, digital, social, OOH, web',
    'Brand experience, UX UI, flows, information architecture, conversion focused pages',
    'Team leadership, agency briefing, vendor management, production supervision',
    'Strong taste, fast iteration, clear decision making under constraints'
  ]
);

-- Insert Work Experience
INSERT INTO cv_work_experience (company, location, title, description, start_date, end_date, responsibilities, order_index)
VALUES
(
  'Camilyo, 12Handz',
  'Tel Aviv',
  'Senior Brand and Marketing Design Lead',
  'Online presence solutions for online service providers',
  '2021',
  'Present',
  ARRAY[
    'Owned brand planning process, target definition, marketing mix, brand interaction strategy',
    'Led end to end marketing design, from concept and systems to execution across channels',
    'Built clearer brand consistency across touchpoints, internal teams, and external suppliers'
  ],
  1
),
(
  'LH, TBWA',
  'Tel Aviv',
  'Senior Creative Art Director',
  'Advertising',
  '2020',
  '2021',
  ARRAY[
    'Led concept, UX UI direction, and execution for integrated digital and social initiatives',
    'Delivered high impact creative across channels, working with copy, strategy, and production'
  ],
  2
),
(
  'Ogilvy',
  'Tel Aviv',
  'Creative, Senior Art Director',
  'Advertising',
  '2019',
  '2020',
  ARRAY[
    'Developed large scale digital and OOH campaigns and experiences',
    'Balanced user relevance with advertiser goals, from idea to launch'
  ],
  3
),
(
  'Hooligans, K Group',
  'Tel Aviv',
  'Creative, Senior Designer',
  'Data driven creative agency',
  '2017',
  '2019',
  ARRAY[
    'Built consumer journeys and brand experiences for B2B SaaS brands',
    'Worked across information architecture, web flows, UX UI, and performance driven creative'
  ],
  4
),
(
  'Avraham Advertising',
  'Tel Aviv',
  'Creative, Senior Art Director',
  '',
  '2016',
  '2017',
  ARRAY[
    'Generated concepts with copy partners, created layouts, storyboards, and production ready assets',
    'Aligned creative to positioning, target audience, and campaign objectives'
  ],
  5
),
(
  'TBWA, Yehoshua',
  'Tel Aviv',
  'Senior Art Director',
  '',
  '2015',
  '2016',
  ARRAY[
    'Created visual ideas and executions for cross media campaigns for leading global brands'
  ],
  6
),
(
  'Tamooz Marketing Communications',
  'Tel Aviv, Geneva',
  'Creative Director',
  '',
  '2012',
  '2014',
  ARRAY[
    'Led a creative team, shaped strategy, and delivered end to end client work across advertising and visual communications'
  ],
  7
),
(
  'Green Ride',
  'Haifa',
  'Creative Director, Head Designer',
  'Automotive startup',
  '2012',
  '2014',
  ARRAY[
    'Led design team, concept ideation to development, transportation design, UX UI, GUI, graphic design'
  ],
  8
),
(
  'Fiat Chrysler Automobiles',
  'Turin',
  'Exterior Designer',
  'Concept car program, under Roberto Giolito, Fiat Centro Stile',
  '2007',
  '2007',
  ARRAY[],
  9
),
(
  'Alfa Romeo',
  'Arese',
  'Interior Designer',
  'Color and trim, under head designers Favilla, Maccolini',
  '2007',
  '2007',
  ARRAY[],
  10
),
(
  'Audi',
  'Milan',
  'Exterior Designer',
  'A6 Avant 2015 program, under Walter de Silva, Audi Group',
  '2006',
  '2007',
  ARRAY[],
  11
),
(
  'Le Cordon Bleu',
  'Boston',
  'Chef du cuisine',
  'Plus four years in top restaurants in Israel, USA, Italy',
  '2005',
  '2005',
  ARRAY[],
  12
),
(
  'IDF, Israel Defence Forces',
  'Israel',
  'Combat soldier, Commander',
  '',
  '1994',
  '1997',
  ARRAY[],
  13
);

-- Insert Education
INSERT INTO cv_education (institution, degree, field, start_year, end_year, order_index)
VALUES
(
  'Scuola Politecnica di Design, Milan',
  'MA, Master of Fine Arts',
  'Transportation Design',
  2005,
  2006,
  1
),
(
  'Bezalel Academy of Art and Design, Jerusalem',
  'BDes, Industrial Design',
  'Product Design',
  1999,
  2005,
  2
);

-- Insert Languages
INSERT INTO cv_languages (language, proficiency, order_index)
VALUES
('English', 'Fluent', 1),
('Italian', 'Fluent', 2),
('Hebrew', 'Fluent', 3),
('German', 'Learning', 4),
('Spanish', 'Proficient', 5),
('French', 'Proficient', 6),
('Arabic', 'Proficient', 7);

-- Insert Skills
INSERT INTO cv_skills (category, skills, order_index)
VALUES
(
  'Design Software',
  ARRAY['Adobe CC', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'Figma', 'XD', 'Sketch', 'InVision'],
  1
),
(
  '3D & Visualization',
  ARRAY['Autodesk Alias', 'SketchUp', 'Vray'],
  2
),
(
  'Web & Productivity',
  ARRAY['Microsoft 365', 'WordPress', 'Elementor'],
  3
);
