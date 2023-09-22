import { line } from '@rebel-framework/terminal';
import { Signature } from '../types';
import readPackageJson from '../helpers/read-package-json';

export const signature: Signature = {};

async function version() {
  const packageData = await readPackageJson('./');
  line(`Rebel v${packageData.version}`);
}

export default {
  signature,
  command: version,
};
