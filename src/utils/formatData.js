import _ from 'lodash';
import dayjs from 'dayjs';

// function is applied to onChange newValue received from MUI DateSelect so it's compatible with what the API expects
export const formatDate = date => dayjs(date).format('YYYY-MM-DDT00:00:00[Z]');

// function is applied to the dates the ui receives from the api
export const getISODate = date => {
  const isValidDate = !isNaN(Date.parse(date));
  return isValidDate ? dayjs(date, 'YYYY-MM-DD').format('YYYY/MM/DD') : date;
};

export const formatAPIData = unformattedData => {
  const result = {};
  const unformattedDataKeys = Object.keys(unformattedData);
  unformattedDataKeys.forEach(key => {
    // format arrays
    if (Array.isArray(unformattedData[key])) {
      // take out fields invalidated by the API
      let cleanArray =
        key === 'labels'
          ? unformattedData[key].map(item => _.omit(item, ['orgUid']))
          : unformattedData[key].map(item =>
              _.omit(item, ['warehouseProjectId', 'orgUid']),
            );
      // reformat fields data type
      cleanArray = cleanArray.map(subObject => {
        const transformedToString = [
          'ratingRangeHighest',
          'ratingRangeLowest',
          'rating',
        ];
        transformedToString.forEach(item => {
          if (subObject[item]) {
            subObject[item] = subObject[item].toString();
          }
        });
        return subObject;
      });
      result[key] = cleanArray;
    }

    // format null values
    else if (unformattedData[key] === null || unformattedData[key] === 'null') {
      result[key] = '';
    }

    // format objects
    else if (typeof unformattedData[key] === 'object') {
      let obj = _.cloneDeep(unformattedData[key]);
      const keysToBeRemoved = ['orgUid', 'warehouseProjectId'];
      keysToBeRemoved.forEach(invalidKey => {
        if (obj[invalidKey] || obj[invalidKey] === null) {
          delete obj[invalidKey];
        }
      });
      result[key] = obj;
    }

    // if none of the above and key name is valid for API requests
    else if (!['orgUid', 'issuanceId'].includes(key)) {
      result[key] = unformattedData[key];
    }
  });

  return result;
};

export const cleanObjectFromEmptyFieldsOrArrays = dataToSend => {
  Object.keys(dataToSend).forEach(el => {
    // clean empty fields
    if (!dataToSend[el]) {
      delete dataToSend[el];
    }

    // clean empty arrays
    if (dataToSend[el]?.length === 0) {
      delete dataToSend[el];
    }

    // clean empty strings within arrays
    // clean tempId used for Ui key iteration purpose
    if (Array.isArray(dataToSend[el])) {
      dataToSend[el].forEach(individualArrayItem =>
        Object.keys(individualArrayItem).forEach(key => {
          if (
            individualArrayItem[key] === '' ||
            individualArrayItem[key] === null ||
            key === 'tempId'
          ) {
            delete individualArrayItem[key];
          }
        }),
      );
    }
  });
};
