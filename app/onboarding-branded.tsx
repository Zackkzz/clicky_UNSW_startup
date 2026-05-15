import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

/** Screen fill — match reference */
const LAVENDER = "#B4A7FF";
const WHITE = "#FFFFFF";
/** Handwritten “clicky” */
const CLICKY_YELLOW = "#FFEFAE";

const OUTLINE_STROKE = 2;
const OUTLINE_OFFSETS: ReadonlyArray<readonly [number, number]> = [
    [-OUTLINE_STROKE, 0],
    [OUTLINE_STROKE, 0],
    [0, -OUTLINE_STROKE],
    [0, OUTLINE_STROKE],
    [-OUTLINE_STROKE, -OUTLINE_STROKE],
    [OUTLINE_STROKE, -OUTLINE_STROKE],
    [-OUTLINE_STROKE, OUTLINE_STROKE],
    [OUTLINE_STROKE, OUTLINE_STROKE],
];

const headlineFont = Platform.select({
    ios: { fontFamily: "HelveticaNeue-Bold" as const },
    android: { fontFamily: "sans-serif" as const },
    default: {},
});

const outlineFont = Platform.select({
    ios: { fontFamily: "HelveticaNeue-BoldItalic" as const },
    android: { fontFamily: "sans-serif-medium" as const },
    default: {},
});

/** White outline, lavender fill — built from stacked Text layers */
function OutlinedHeadline({ label }: { label: string }) {
    return (
        <View style={styles.outlineWrap} accessible accessibilityLabel={label}>
            {OUTLINE_OFFSETS.map(([dx, dy], index) => (
                <Text
                    key={`${label}-stroke-${index}`}
                    style={[
                        styles.outlineLine,
                        styles.outlineStroke,
                        { transform: [{ translateX: dx }, { translateY: dy }] },
                    ]}
                    importantForAccessibility="no-hide-descendants"
                    accessibilityElementsHidden
                >
                    {label}
                </Text>
            ))}
            <Text style={[styles.outlineLine, styles.outlineFill]}>{label}</Text>
        </View>
    );
}

/**
 * Onboarding marketing screen — headline copy only.
 * Tap anywhere to enter the main app.
 */
export default function OnboardingBrandedScreen() {
    return (
        <Pressable
            style={styles.root}
            onPress={() => router.replace("/(tabs)")}
            accessibilityRole="button"
            accessibilityLabel="Continue to app"
        >
            <StatusBar style="dark" />
            <View style={styles.inner}>
                <View style={styles.topCopy}>
                    <Text style={styles.goFor}>GO FOR</Text>
                    <OutlinedHeadline label="DYNAMIC" />
                    <View style={styles.outlineSpacer} />
                    <OutlinedHeadline label="UNI LIFE" />
                </View>

                <View style={styles.secRow}>
                    <Text style={styles.withWord}>WITH</Text>
                    <Text style={styles.clicky}>clicky</Text>
                </View>

                <View style={styles.flexSpacer} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: LAVENDER,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: Platform.select({ ios: 52, android: 44, default: 44 }),
        paddingBottom: 20,
    },
    topCopy: {
        alignSelf: "center",
        alignItems: "flex-start",
        marginLeft: 0,
        transform: [{ translateX: -30 }],
    },
    goFor: {
        color: WHITE,
        fontStyle: "italic",
        fontWeight: "800",
        textAlign: "left",
        fontSize: 60,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        alignSelf: "stretch",
        ...headlineFont,
    },
    outlineWrap: {
        alignSelf: "flex-start",
    },
    outlineLine: {
        fontSize: 60,
        lineHeight: 72,
        fontWeight: "800",
        fontStyle: "italic",
        letterSpacing: 2.5,
        textTransform: "uppercase",
        textAlign: "left",
        ...outlineFont,
    },
    outlineStroke: {
        position: "absolute",
        left: 0,
        top: 0,
        color: WHITE,
    },
    outlineFill: {
        color: LAVENDER,
    },
    outlineSpacer: {
        height: 4,
    },
    secRow: {
        alignSelf: "center",
        transform: [{ translateX: 50 }],
    },
    withWord: {
        marginTop: 20,
        paddingLeft: 20,
        color: WHITE,
        fontWeight: "800",
        textAlign: "left",
        alignSelf: "stretch",
        fontSize: 70,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        ...headlineFont,
    },
    clicky: {
        textAlign: "right",
        marginTop: 20,
        fontSize: 150,
        paddingRight: 60,
        lineHeight: 76,
        color: CLICKY_YELLOW,
        fontFamily: "Caveat_700Bold",
        textShadowColor: "rgba(0,0,0,0.1)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 2,
    },
    flexSpacer: {
        flexGrow: 1,
        minHeight: 12,
    },
});
