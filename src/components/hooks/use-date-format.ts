declare type FormatType =
  | 'YYYY-MM-DD'
  | 'YYYY-MM'
  | 'YYYY'
  | 'YYYY-MM-DD HH:mm:ss'
  | 'week';

const useDateFormat = (format: FormatType): any => {
  switch (format) {
    case 'YYYY-MM-DD': {
      return {};
    }
    case 'YYYY-MM': {
      return {
        picker: 'month',
      };
    }
    case 'YYYY': {
      return {
        picker: 'year',
      };
    }
    case 'YYYY-MM-DD HH:mm:ss': {
      return {
        showTime: true,
      };
    }
    case 'week': {
      return {
        picker: 'week',
      };
    }
    default: {
      return {};
    }
  }
};

export default useDateFormat;
