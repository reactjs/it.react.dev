const GithubSlugger = require('github-slugger');

const Octokit = require('@octokit/rest');

const octokit = new Octokit(
  {
    auth: `token ${process.env.GITHUB_AUTH_TOKEN}`,
  }
);

const issueTemplate = (sectionName, taskName) => ({
  'title': `Translation for the page '${sectionName} -> ${taskName}'`,
  'body': `# Please help us translating this page in Italian!
  
  **Aiutaci a tradurre questa pagina in Italiano!**

  You can find all the details about how to help here: https://github.com/${repoOwner}/${repoName}/issues/${progressIssueNumber}
  
  ## GRAZIE! :smile:`,

  'labels': [
    'help wanted', 'good first issue',
  ],
});

const arg = process.argv.slice(2);
const MODE = (!arg || arg.toString().trim() === '') ? 'plan' : arg;

const repoOwner = 'reactjs';
const repoName = 'it.reactjs.org';
const progressIssueNumber = 1;


process.stdout.write('\x1b[36m>>> openIssuesFromMD \x1b[34mv0.0.0.1\x1b[0m by \x1b[1m@deblasis\x1b[0m\n\n');
if (!process.env.GITHUB_AUTH_TOKEN) {
  process.stderr.write(`\x1b[31mGITHUB_AUTH_TOKEN environment variable not defined, exiting\x1b[0m\n\n`);
  process.exit(1);
}
if (MODE != 'plan' && MODE != 'create') {
  process.stderr.write(`\x1b[31mUnrecognized mode=${MODE}, valid options are: plan, create\x1b[0m\n\n`);
  process.exit(1);
}
process.stdout.write(`\x1b[36mRunning for repo \x1b[0m\x1b[34m${repoOwner}/${repoName} in [\x1b[1m${MODE} mode\x1b[36m]\x1b[0m\n\n`);
process.stdout.write(`\x1b[36mFetching Progress Issue ( \x1b[34mhttps://github.com/${repoOwner}/${repoName}/issues/${progressIssueNumber}\x1b[36m ) ...\n\n`);

octokit.issues.get({ owner: repoOwner, repo: repoName, number: progressIssueNumber }).then(issue => {
  
  let body = issue.data.body;

  const lines = body.split('\n');
  
  let sectionsTree = {
    _lastSection: '',
    names: [],
    sections: [],
  };

  const slugger = new GithubSlugger();

  let arr = lines
    .map(tagLine(slugger))
    .filter(nullValues)
    .filter(assignedTasks)
    .reduce(assignTaskToSection, sectionsTree);

  let sections = arr.sections
    .filter(emptySections);

  let issues = sections.reduce(sectionsToIssues(issueTemplate), []);

  return issues;
}).then(issues => {
  
  let existingIssues = [];

  octokit.issues.listForRepo({ owner: repoOwner, repo: repoName, per_page: 200}).then(list => {
  
    existingIssues = list.data.map((issue) => issue.title);
    
    const toBeCreatedTitles = issues.map((i) => i.title).filter(i => existingIssues.indexOf(i) == -1);

    if (toBeCreatedTitles.length == 0 ) {
      process.stdout.write('\x1b[32mThere is nothing to do! All the tasks in the markdown that are unticked should already have a corresponding issue!\n\n');
      process.exit(0);
    }
    process.stdout.write('These are the issues that we are going to create:\n');

    toBeCreatedTitles.forEach((i) => process.stdout.write(` -Issue title: ${i}\n`));
    process.stdout.write('\n');

    if (MODE == 'create') {
      process.stdout.write('\x1b[32mCREATING ISSUES... hold on!\x1b[0m\n\n');

      issues.filter(i => toBeCreatedTitles.indexOf(i.title) !== -1).forEach((i) => {

        octokit.issues.create({ owner: repoOwner, repo: repoName, ...i })
          .then(created => {
            process.stdout.write(`\n\x1b[36m"${created.data.title}" \x1b[32mCREATED\x1b[36m => \x1b[34mhttps://github.com/${repoOwner}/${repoName}/issues/${created.data.number} \x1b[36m!\x1b[0m\n\n`);
          });
      });

    } else {
      process.stdout.write('If you are happy with it, launch this script with the "create" argument (eg: \x1b[34mGITHUB_AUTH_TOKEN={your_token} yarn create-translation-github-issues create\x1b[36m)\n\n');
    }
  });


}).catch(error => {
  process.stderr.write(`\x1b[36mThere was an error!\x1b[0m)\n\n`);
  console.log(error);
});



const sectionsToIssues = (issueTemplate) => (issues, el) => {
  el.map(taskToIssue(issueTemplate))
    .forEach(task => {
      issues.push(task);
    });
  return issues;
};


const taskToIssue = (issueTemplate, fileStats) => (el) => {
  let issue = issueTemplate(el.sectionName, el.name);
  return issue;
};

const tagLine = (slugger) => (line) => {
  const formatted = line.trim();

  if (formatted.startsWith('##')) {
    return {
      type: 'sectionStart',
      name: formatted.slice(formatted.indexOf(' ') + 1),
    };
  }
  if (formatted.startsWith('* [ ]')) {
    const name = formatted.slice(formatted.indexOf(' ') + 1).replace('[ ] ', '');
    const slugged = slugger.slug(name);
    return {
      type: 'task',
      name,
      slugged,
    };
  }
  return null;
};


const nullValues = (el) => el != null;

const assignedTasks = (el) => {
  if (el.type != 'task') {return true;}

  return el.name.indexOf('(@') == -1;
};

const emptySections = (el) => el.length > 0;

const assignTaskToSection = (state, el) => {
  if (el.type != 'task') {
    state.sections.push([]);
    state.names.push(el.name);
    state._lastSection = el.name;
  } else {
    const sectionId = state.names.indexOf(state._lastSection);
    el.sectionName = state._lastSection;
    state.sections[sectionId].push(el);
  }
  return state;
};