/**
 * Interface for the Github Repo Response
 */
export interface IGithubRepoResponse {
    readonly name: string;
    readonly id: number;
    readonly node_id: string;
    readonly full_name: string;
    readonly organization: string;
    readonly html_url: string;
}

/**
 * Interface for the Github User Response
 */
export interface GitHubIssue {
    readonly id: number;
    readonly node_id: string;
    readonly url: string;
    readonly repository_url: string;
    readonly labels_url: string;
    readonly comments_url: string;
    readonly events_url: string;
    readonly html_url: string;
    readonly number: number;
    readonly state: string;
    readonly title: string;
    readonly body: string;
    readonly user: GitHubUser;
    readonly labels: GitHubLabel[];
    readonly assignee: GitHubUser | null;
    readonly assignees: GitHubUser[];
    readonly milestone: GitHubMilestone | null;
    readonly locked: boolean;
    readonly active_lock_reason: string | null;
    readonly comments: number;
    readonly pull_request?: GitHubPullRequest;
    readonly closed_at: string | null;
    readonly created_at: string;
    readonly updated_at: string;
    readonly closed_by: GitHubUser | null;
    readonly author_association: string;
    readonly state_reason: string | null;
}

/**
 * Interface for the Github User Response
 */
export interface GitHubUser {
    readonly login: string;
    readonly id: number;
    readonly node_id: string;
    readonly avatar_url: string;
    readonly gravatar_id: string;
    readonly url: string;
    readonly html_url: string;
    readonly followers_url: string;
    readonly following_url: string;
    readonly gists_url: string;
    readonly starred_url: string;
    readonly subscriptions_url: string;
    readonly organizations_url: string;
    readonly repos_url: string;
    readonly events_url: string;
    readonly received_events_url: string;
    readonly type: string;
    readonly site_admin: boolean;
}

/**
 * Github label.
 */
export interface GitHubLabel {
    readonly id: number;
    readonly node_id: string;
    readonly url: string;
    readonly name: string;
    readonly description: string;
    readonly color: string;
    readonly default: boolean;
}

/**
 * Github milestone.
 */
export interface GitHubMilestone {
    readonly url: string;
    readonly html_url: string;
    readonly labels_url: string;
    readonly id: number;
    readonly node_id: string;
    readonly number: number;
    readonly state: string;
    readonly title: string;
    readonly description: string;
    readonly creator: GitHubUser;
    readonly open_issues: number;
    readonly closed_issues: number;
    readonly created_at: string;
    readonly updated_at: string;
    readonly closed_at: string | null;
    readonly due_on: string | null;
}

/**
 * Github pull request.
 */
export interface GitHubPullRequest {
    readonly url: string;
    readonly html_url: string;
    readonly diff_url: string;
    readonly patch_url: string;
}

export interface GitHubCommit {
    readonly url: string;
    readonly sha: string;
    readonly node_id: string;
    readonly html_url: string;
    readonly comments_url: string;
    readonly commit: GitHubCommitDetails;
    readonly author: GitHubUser;
    readonly committer: GitHubUser;
    readonly parents: GitHubParent[];
}

export interface GitHubCommitDetails {
    readonly url: string;
    readonly author: GitHubCommitAuthor;
    readonly committer: GitHubCommitAuthor;
    readonly message: string;
    readonly tree: GitHubTree;
    readonly comment_count: number;
    readonly verification: GitHubVerification;
}

export interface GitHubCommitAuthor {
    readonly name: string;
    readonly email: string;
    readonly date: string;
}

export interface GitHubTree {
    readonly url: string;
    readonly sha: string;
}

export interface GitHubVerification {
    readonly verified: boolean;
    readonly reason: string;
    readonly signature: string | null;
    readonly payload: string | null;
}

export interface GitHubParent {
    readonly url: string;
    readonly sha: string;
}

export interface GithubPullRequest {
    diff_url: string;
    patch_url: string;
    review_comment_url: string;
    statuses_url: string;
    active_lock_reason: string | null;
    requested_reviewers: RequestedReviewer[];
    requested_teams: RequestedTeam[];
    _links: Links;
    auto_merge: boolean | null;
    draft: boolean;
  }
  
  export interface RequestedReviewer {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  }
  
  export interface RequestedTeam {
    id: number;
    node_id: string;
    url: string;
    html_url: string;
    name: string;
    slug: string;
    description: string;
    privacy: string;
    permission: string;
    notification_setting: string;
    members_url: string;
    repositories_url: string;
    parent: Parent | null;
  }
  
  export interface Parent {
    id: number;
    node_id: string;
    url: string;
    html_url: string;
    name: string;
    slug: string;
    description: string;
    privacy: string;
    permission: string;
    notification_setting: string;
    members_url: string;
    repositories_url: string;
  }
  
  export interface Links {
    self: Link;
    html: Link;
    issue: Link;
    comments: Link;
    review_comments: Link;
    review_comment: Link;
    commits: Link;
    statuses: Link;
  }
  
  export interface Link {
    href: string;
  }