<% if (use.coffee) { %>
import coffeeify from 'coffeeify';<% } %>
import jadeify from 'jadeify';

export default function(build) {  
  return [
    {
      name: 'main',
      entries: `./${build.dirs.src.client}/scripts/main`,
      extensions: [<% if (use.coffee) { %>
        '.coffee',<% } %>
        '.jade'
      ],
      transform: [<% if (use.coffee) { %>
        coffeeify,<% } %>
        jadeify
      ],
      debug: true,
      watchable: true,
      scopes: ['app']
    },
    {
      name: 'test',
      entries: `./${build.dirs.test.client}/scripts/${build.globPatterns.TEST}`,
      extensions: [<% if (use.coffee) { %>
        '.coffee',<% } %>
        '.jade'
      ],
      transform: [<% if (use.coffee) { %>
        coffeeify,<% } %>
        jadeify
      ],
      debug: true,
      watchable: true,
      destDir: `${build.dirs.tgt.client}/test/scripts`,
      scopes: ['test'],
      destName: 'main.js'
    },
    {
      name: 'vendor',
      exports: [
        'jquery',
        'lodash',<% if (use.backbone) { %>
        'backbone',<% } %><% if (use.bootstrap) { %>
        'bootstrap-sass'<% } %>
      ]
    }
  ];
};

