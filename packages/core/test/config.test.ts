import { ConfigNotFoundError, useConfig } from '../src';
import { include } from '../src/helpers/include';

// Mocking the include function
jest.mock('../src/helpers/include', () => ({
  include: jest.fn(),
}));

describe('useConfig', () => {
  afterEach(() => {
    (include as jest.Mock).mockReset();
  });

  it('should return the correct configuration', () => {
    // Mock data
    const mockConfig = {
      key: 'value',
      anotherKey: 'anotherValue',
    };

    // Mocking the behavior of the include function
    (include as jest.Mock).mockReturnValueOnce({
      default: mockConfig,
    });

    const config = useConfig();
    expect(config).toEqual(mockConfig);
  });

  it('should throw an error if the config is not in the correct format', () => {
    // Mocking the behavior of the include function to return something unexpected
    (include as jest.Mock).mockReturnValueOnce({
      incorrectKey: {},
    });

    expect(() => useConfig()).toThrow(ConfigNotFoundError);
  });
});
