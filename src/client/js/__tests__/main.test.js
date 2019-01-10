import WTF from '../main';

/**
 * @test {WTF}
 */
describe('WTF', () => {
  const instance = new WTF();

  /**
   * @test {WTF#constructor}
   */
  it('.constructor()', () => {
    expect(WTF).toBeDefined();
  });

  /**
   * @test {WTF#load}
   */
  it('.load()', () => {
    expect(instance.app).toEqual(null);
    instance.load();
    expect(instance.app).toBeDefined();
    expect(instance.body).toBeDefined();
    expect(instance.chatInput).toBeDefined();
  });

  /**
   * @test {WTF#documentReady}
   */
  it('.documentReady()', () => {
    expect(instance.app).toEqual(null);
    instance.documentReady();
    expect(instance.app).toBeDefined();
    expect(instance.body).toBeDefined();
    expect(instance.chatInput).toBeDefined();
  });

  // /**
  //  * @test {WTF#addClasses}
  //  */
  // it('.addClasses()', () => {
  //   const instance = new WTF();
  //   console.log(instance);
  //   expect(instance.chatInput).toBeDefined();
  // });
});
