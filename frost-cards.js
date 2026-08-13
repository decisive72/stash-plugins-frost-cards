(function () {
    const PluginApi = window.PluginApi;
    const React = PluginApi.React;
    const { Link } = PluginApi.libraries.ReactRouterDOM;
    const { FontAwesomeIcon } = PluginApi.libraries.ReactFontAwesome;
    const { FormattedMessage } = PluginApi.libraries.Intl;
    const { faTag, faUser } = PluginApi.libraries.FontAwesomeSolid;

    function getSceneNumber(scene, fromGroupId) {
        if (!fromGroupId) return undefined;
        const group = scene.groups.find((g) => g.group.id === fromGroupId);
        return group?.scene_index ?? undefined;
    }

    PluginApi.patch.instead("SceneCard.Overlays", () => null);
    PluginApi.patch.instead("SceneCard.Popovers", () => null);
    PluginApi.patch.instead("SceneCard.Details", function (props, _, original) {
        const scene = props.scene;
        const studio = scene.studio ?? null;
        const date = scene.date ?? null;
        const description = scene.details ?? null;
        const performers = scene.performers;
        const tags = scene.tags;
        const ocount = scene.o_counter;
        const display = [
            [
                performers.length > 0,
                React.createElement("span", { className: "frost-card__performers" },
                    React.createElement(FontAwesomeIcon, { icon: faUser, className: "frost-card__icon" }),
                    React.createElement("span", {}, performers.length)
                )
            ],
            [
                tags.length > 0,
                React.createElement("span", { className: "frost-card__tags" },
                    React.createElement(FontAwesomeIcon, { icon: faTag, className: "frost-card__icon" }),
                    React.createElement("span", {}, tags.length)
                )
            ],
            [
                ocount > 0,
                React.createElement("span", { className: "frost-card__o-count" },
                    React.createElement(
                        "svg",
                        { className: "svg-inline--fa frost-card__icon", ariaHidden: "true", viewBox: "0 0 36 36" },
                        React.createElement(
                            "path",
                            {
                                fill: "currentColor",
                                d: "M22.855.758L7.875 7.024l12.537 9.733c2.633 2.224 6.377 2.937 9.77 1.518c4.826-2.018 7.096-7.576 5.072-12.413C33.232 1.024 27.68-1.261 22.855.758zm-9.962 17.924L2.05 10.284L.137 23.529a7.993 7.993 0 0 0 2.958 7.803a8.001 8.001 0 0 0 9.798-12.65zm15.339 7.015l-8.156-4.69l-.033 9.223c-.088 2 .904 3.98 2.75 5.041a5.462 5.462 0 0 0 7.479-2.051c1.499-2.644.589-6.013-2.04-7.523z",
                            }
                        )
                    ),
                    React.createElement("span", {}, ocount)
                )
            ]
        ].filter(x => x[0]).map(x => x[1]);

        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { className: "frost-card__meta" },
                React.createElement(
                    "div",
                    {},
                    studio &&
                    React.createElement(
                        Link,
                        { to: `/studios/${studio.id}`, className: "frost-card__studio" },
                        studio.name
                    ),
                    studio && date &&
                    React.createElement("span", { className: "frost-card__meta-sep" }, "•"),
                    date &&
                    React.createElement("span", { className: "scene-card__date frost-card__date" }, date),
                    display.length === 1 &&
                    React.createElement("span", { className: "frost-card__meta-sep" }, "•"),
                    display.length === 1 && display[0]
                ),
                display.length > 1 && React.createElement(
                    "div",
                    {},
                    ...display
                )
            ),
            original(props)
        );
    });
    PluginApi.patch.instead("SceneCard", function (props, _, original) {
        const rendered = original(props);

        const sceneNumber = getSceneNumber(props.scene, props.fromGroupId);

        if (!sceneNumber) {
            return rendered;
        }

        const sceneNumberLine = React.createElement(
            "span",
            { className: "scene-group-scene-number" },
            React.createElement(
                FormattedMessage,
                { id: "scene" }
            ),
            ` #${sceneNumber}`
        );

        return React.cloneElement(rendered, {
            pretitleIcon: sceneNumberLine,
        });
    });
})();
