import WTF from '../main';

/** @test {WTF} */
describe('WTF', () => {
  /** @test {WTF#constructor} */
  it('.constructor()', () => {
    const instance = new WTF();
    expect(instance).toBeDefined();
  });

  /** @test {WTF#constructor} */
  it('.loads()', () => {
    const instance = new WTF();
    const spy = jest.spyOn(instance, 'load');
    instance.load();
    expect(spy).toBeDefined();
  });

  it('fails', () => {
    expect(true).toEqual(false);
  });
});
