var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/michaelmherrera/fitch.git', // Update to point to your repository  
        user: {
            name: 'Michael Herrera', // update to use your name
            email: '52046844+michaelmherrera@users.noreply.github.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)