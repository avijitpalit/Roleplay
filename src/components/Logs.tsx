import React, { useState } from 'react'

export default function Logs({logs}) {
	return (
		<div className='flex flex-col gap-3 mt-5'>
			{ Object.entries(logs).map(([key, value], index) => (
				<div key={index}>
					<div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{key}</div>
					<div className="text-sm mt-1">{value}</div>
				</div>
			)) }
		</div>
	)
}
