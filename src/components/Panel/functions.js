export const panelFunctions = {
	getMenu: () => {
		const menu = [
			{
				id: "dashboard",
				content: "Dashboard",
				accessibilityLabel: "Dashboard",
				link: "/panel/dashboard",
				panelID: "dashboard"
			},
			{
				id: "accounts",
				content: "Accounts",
				accessibilityLabel: "Accounts",
				link: "/panel/accounts",
				panelID: "accounts"
			},
			{
				id: "import",
				content: "Import/Upload",
				accessibilityLabel: "Import",
				link: "/panel/import",
				panelID: "import"
			},
			{
				id: "profiling",
				content: "Profiling",
				accessibilityLabel: "Profiling",
				link: "/panel/profiling",
				panelID: "profiling"
			},
			{
				id: "products",
				content: "Products",
				accessibilityLabel: "Products",
				link: "/panel/products",
				panelID: "products"
			},
            {
                id: "orders",
                content: "Orders",
                accessibilityLabel: "Orders",
                link: "/panel/orders",
                panelID: "orders"
            },
			{
				id: "configuration",
				content: "Configuration",
				accessibilityLabel: "Configuration",
				link: "/panel/configuration",
				panelID: "configuration"
			},
			{
				id: "plans",
				content: "Plans",
				accessibilityLabel: "Plans",
				link: "/panel/plans",
				panelID: "plans"
			},
			{
				id: "queuedtasks",
				content: "Activities",
				accessibilityLabel: "Activities",
				link: "/panel/queuedtasks",
				panelID: "queuedtasks"
			},
			{
				id: "help",
				content: "Help",
				accessibilityLabel: "HELP",
				link: "/panel/help",
				panelID: "help"
			}
		];
		return menu;
	}
};
