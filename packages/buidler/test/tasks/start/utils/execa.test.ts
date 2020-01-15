import { assert } from 'chai';
import { execaPipe } from '~/src/tasks/start/utils/execa';
import * as path from 'path';

describe('execa.ts', () => {
  describe('when calling pwd', () => {
    let res: any;

    before('call pwd', async () => {
      res = await execaPipe('pwd', ['-L', '-P'], {});
    });

    it('should have printed console output with the expected path', async () => {
      const dir = path.basename(res.stdout);
      assert.equal(dir, 'buidler');
    });

    it('should have ended with exit code 0', async () => {
      assert.equal(res.exitCode, 0, 'Invalid exit code.');
    });

    it.skip('more tests needed', async () => {});
  });
});
