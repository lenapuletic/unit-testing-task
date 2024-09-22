const unitTestingTask = require('./unitTestingTask');
const timezoneMock = require('timezone-mock');
let mockDate = new Date();

describe('Test the types of unitTestingTask arguments', () => {
  beforeEach(() => {
    mockDate = Date.parse('2024-07-30T11:55:30.355');
  });

  it('Should throw an error if the format argument is not a string', () => {
    expect(() => unitTestingTask(null, mockDate)).toThrow(
      'Argument `format` must be a string'
    );
  });

  it('Should throw an error if the date argument is not an instance of Date or string', () => {
    expect(() => unitTestingTask('YYYY', null)).toThrow(
      'Argument `date` must be instance of Date or Unix Timestamp or ISODate String'
    );
  });

  it('Should format current date if no date is provided', () => {
    expect(() =>
      unitTestingTask('YYYY-MM-dd').toBe(unitTestingTask('YYYY-MM-dd', now))
    );
  });
});

describe('Test formatting the date 2024-07-30T11:55:30.355 and timezone', () => {
  beforeEach(() => {
    mockDate = Date.parse('2024-07-30T11:55:30.355');
    timezoneMock.register('Etc/GMT+1');
  });

  it.each([
    ['YYYY', '2024'],
    ['YY', '24'],
  ])('Format year, token "%s" returns "%s"', (format, result) => {
    expect(unitTestingTask(format, mockDate)).toBe(result);
  });

  it.each([
    ['MMMM', 'July'],
    ['MMM', 'Jul'],
    ['M', '7'],
  ])('Format month, token "%s" returns "%s"', (format, result) => {
    expect(unitTestingTask(format, mockDate)).toBe(result);
  });

  it.each([
    ['DDD', 'Tuesday'],
    ['DD', 'Tue'],
    ['D', 'Tu'],
    ['d', '30'],
  ])('Format day, token "%s" returns "%s"', (format, result) => {
    expect(unitTestingTask(format, mockDate)).toBe(result);
  });

  it.each([
    ['HH', '11'],
    ['H', '11'],
    ['hh', '11'],
    ['h', '11'],
  ])('Format day, token "%s" returns "%s"', (format, result) => {
    expect(unitTestingTask(format, mockDate)).toBe(result);
  });

  it.each([
    ['s', '30'],
    ['f', '355'],
  ])('Format day, token "%s" returns "%s"', (format, result) => {
    expect(unitTestingTask(format, mockDate)).toBe(result);
  });

  describe('Test values with padded zeroes', () => {
    it.each([
      ['ff', '355'],
      ['ss', '30'],
      ['m', '55'],
      ['mm', '55'],
      ['hh', '11'],
      ['h', '11'],
      ['H', '11'],
      ['HH', '11'],
      ['dd', '30'],
      ['MM', '07'],
    ])('Format date, token "%s" returns "%s"', (format, result) => {
      expect(unitTestingTask(format, mockDate)).toBe(result);
    });
  });

  it('Should return AM', () => {
    expect(unitTestingTask('A', mockDate)).toBe('AM');
  });

  it('Should return am', () => {
    expect(unitTestingTask('a', mockDate)).toBe('am');
  });

  describe('Test PM case', () => {
    beforeEach(() => {
      mockDate = Date.parse('2024-07-30T18:55:30.355');
    });
    it('Should return PM', () => {
      expect(unitTestingTask('A', mockDate)).toBe('PM');
    });

    it('Should return pm', () => {
      expect(unitTestingTask('a', mockDate)).toBe('pm');
    });
  });

  it.each([
    ['ZZ', '-0100'],
    ['Z', '-01:00'],
  ])(
    'Returns the correct time zone, token "%s" returns "%s"',
    (format, result) => {
      expect(unitTestingTask(format, mockDate)).toBe(result);
    }
  );
});

describe('Test language', () => {
  it('Language should be en if the value is falsy', () => {
    expect(unitTestingTask.lang('')).toBe('en');
  });

  it.each([
    ['en', null, 'en'],
    ['uk', {}, 'uk'],
    ['fr', {}, 'fr'],
    ['ru', {}, 'ru'],
    ['pl', {}, 'pl'],
    ['tt', {}, 'tt'],
  ])('Expect the language to be correct', (lang, options, expectedLang) => {
    expect(unitTestingTask.lang(lang, options)).toBe(expectedLang);
  });
});

describe('Test formats', () => {
  beforeEach(() => {
    mockDate = Date.parse('2024-07-30T11:55:30.355');
  });

  it.each([
    ['ISODate', '2024-07-30'],
    ['ISOTime', '11:55:30'],
    ['ISODateTime', '2024-07-30T11:55:30'],
  ])(
    'Correct format for values, token "%s" returns "%s"',
    (formatName, result) => {
      expect(unitTestingTask(formatName, mockDate)).toBe(result);
    }
  );
});
