import { ConfigNotFoundError, useConfig } from '.';
import { include } from './helpers/include';

jest.mock('./helpers/include', () => ({
  include: jest.fn(),
}));

describe('useConfig', () => {
  afterEach(() => {
    (include as jest.Mock).mockReset();
  });

  it('should return the correct configuration', () => {
    const mockConfig = {
      key: 'value',
      anotherKey: 'anotherValue',
    };

    (include as jest.Mock).mockReturnValueOnce({
      default: mockConfig,
    });

    const config = useConfig();
    expect(config).toEqual(mockConfig);
  });

  it('should throw an error if the config is not in the correct format', () => {
    (include as jest.Mock).mockReturnValueOnce({
      incorrectKey: {},
    });

    expect(() => useConfig()).toThrow(ConfigNotFoundError);
  });
});
