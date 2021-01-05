/* global document, Event */
import App from '../app';

/**
 * @test {App}
 */
describe('App', () => {
  const instance = new App();

  /**
   * @test {App#constructor}
   */
  it('.constructor()', () => {
    expect(instance).toBeDefined();
  });

  /**
   * @test {App#load}
   */
  it('.load()', () => {
    instance.readyCallback = jest.fn();
    instance.load();
    expect(instance.loginButton.click).toBeDefined();
    expect(instance.createButton.click).toBeDefined();
    expect(instance.wrapper.click).toBeDefined();
    expect(instance.yes.click).toBeDefined();
    expect(instance.no.click).toBeDefined();
    expect(instance.rememberMe.click).toBeDefined();
    expect(instance.guest.click).toBeDefined();
    expect(instance.registerButton.click).toBeDefined();
    expect(instance.cancelButton.click).toBeDefined();
    expect(instance.about.click).toBeDefined();
    expect(instance.credits.click).toBeDefined();
    expect(instance.git.click).toBeDefined();
    expect(instance.respawn.click).toBeDefined();
    expect(instance.canvas.click).toBeDefined();
  });

  /**
   * @test {App#welcomeContinue}
   */
  it('.welcomeContinue()', () => {
    expect(instance.welcomeContinue()).toEqual(false);
    instance.game = {
      storage: {
        data: {},
        save: jest.fn(),
      },
    };
    instance.body.addClass('welcomeMessage');
    expect(instance.game.storage.data.welcome).toEqual(undefined);
    expect(instance.body[0].className).toEqual('welcomeMessage');

    expect(instance.welcomeContinue()).toEqual(true);
    expect(instance.game.storage.data.welcome).toEqual(false);
    expect(instance.body[0].className).toEqual('');
  });

  /**
   * @test {App#login}
   */
  it('.login()', () => {
    expect(instance.login()).toEqual(false);

    instance.logginIn = false;
    expect(instance.logginIn).toEqual(false);

    instance.game = {
      loaded: true,
      connect: jest.fn(),
    };

    expect(instance.statusMessage).toEqual('You should turn back now...');
    instance.statusMessage = null;

    expect(instance.login()).toEqual(true);
  });

  /**
   * @test {App#loginAsGuest}
   */
  it('.loginAsGuest()', () => {
    instance.game = null;
    expect(instance.loginAsGuest()).toEqual(false);
    instance.game = {};
    expect(instance.loginAsGuest()).toEqual(true);
  });

  /**
   * @test {App#loadCharacter}
   */
  it('.loadCharacter()', () => {
    expect(instance.loadCharacter()).toEqual(false);
  });

  /**
   * @test {App#rememberMe}
   */
  it('.rememberMe()', () => {
    expect(instance.rememberLogin()).toEqual(false);
    instance.game = {
      storage: {
        toggleRemember: jest.fn(),
      },
    };
    expect(instance.rememberLogin()).toEqual(true);
  });

  /**
   * @test {App#respawnPlayer}
   */
  it('.respawn()', () => {
    expect(instance.respawnPlayer()).toEqual(false);
    instance.game = {
      player: {
        dead: true,
      },
      respawn: jest.fn(),
    };
    expect(instance.respawnPlayer()).toEqual(true);
  });

  /**
   * @test {App#keydownEventListener}
   */
  it('.keydownEventListener()', () => {
    instance.game = false;
    expect(instance.keydownEventListener(new Event('keydown'))).toEqual(false);
    instance.game = {};
    expect(instance.keydownEventListener(new Event('keydown'))).toEqual(true);
  });

  /**
   * @test {App#keyupEventListener}
   */
  it('.keyupEventListener()', () => {
    expect(instance.keyupEventListener(new Event('keyup'))).toEqual(false);
    instance.game = {
      started: true,
      input: {
        keyUp: jest.fn(),
      },
    };
    expect(instance.keyupEventListener(new Event('keyup'))).toEqual(true);
  });

  /**
   * @test {App#keyupEventListener}
   */
  it('.keyupEventListener()', () => {
    instance.game = null;
    expect(instance.mousemoveEventListener(new Event('mousemove'))).toEqual(false);

    const setCoords = jest.fn();
    const moveCursor = jest.fn();
    instance.game = {
      started: true,
      input: {
        setCoords,
        moveCursor,
      },
    };

    expect(instance.mousemoveEventListener(new Event('mousemove'))).toEqual(true);
    expect(moveCursor).toBeCalled();
    expect(setCoords).toBeCalled();
  });

  /**
   * @test {App#canvasClickEventListener}
   */
  it('.canvasClickEventListener()', () => {
    const event = {
      button: 0,
    };

    instance.game = null;
    expect(instance.canvasClickEventListener(event)).toEqual(false);

    instance.game = {
      started: true,
      input: {
        handle: jest.fn(),
      },
    };

    expect(instance.canvasClickEventListener(event)).toEqual(true);
  });

  /**
   * @test {App#cleanErrors}
   */
  it('.cleanErrors()', () => {
    expect(instance.loginFields).toBeDefined();
    expect(instance.registerFields).toBeDefined();
    instance.cleanErrors();

    expect(document.querySelectorAll('.field-error').length).toEqual(0);
    expect(document.querySelectorAll('.validation-error').length).toEqual(0);
    expect(document.querySelectorAll('.status').length).toEqual(0);
  });

  /**
   * @test {App#displayScreen}
   */
  it('.displayScreen()', () => {
    expect(instance.displayScreen()).toEqual(undefined);
  });
});
