/** @type {import('next').NextConfig} */
module.exports = {
	experimental: {
		serverActions: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
			},
		],
	},
};
