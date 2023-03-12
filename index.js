"use strict"

import { getUserByName, getUserInfractions } from './user-api.js';

function getReasonForInfractionLinkified(name, callback)
{
	getUserByName(name, function (user)
	{
		getUserInfractions(user.id, function (result)
		{
			// find most recent infraction
			let foundIndex = 0;
			let foundPoints = 0;
			for (let i = 1; i < result.length; i++)
			{
				if (result[i].id > result[foundIndex].id)
				{
					foundIndex = i;
				}
				if (result[i].points > result[foundPoints].points)
				{
					foundPoints = i;
				}
			}

			// replace urls by links
			callback(result[foundIndex].reason.replace(
				/\bhttps:\/\/\S+/,
				match => '<a href=' + match + '>' + match + '</a>'
			), result[foundPoints].reason.replace(
				/\bhttp:\/\/\S+/,
				match => '<a href=' + match + '>' + match + '</a>'
			));
		});
	});
}

/**
 * Returns reason of the worst & the most recent user infraction with linkified urls
 * @param {string} username
 * @returns {Promise.<Object>}
 */
export function getRelevantInfractionReasons(username)
{
	return new Promise(function (resolve)
	{
		getReasonForInfractionLinkified(username, function (mostRecent,worst)
		{
			resolve({mostRecent, worst});
		});
	});
}

