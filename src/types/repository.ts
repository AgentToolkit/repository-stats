export default interface Repository {
  name: string;
  shortname?: string;
  pypi_package_name: string;
  github_organization: string;
  github_repository_url: string;
  version?: string;
}