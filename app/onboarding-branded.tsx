import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Text as SvgText } from "react-native-svg";

/** Screen fill — match reference */
const LAVENDER = "#B4A7FF";
const WHITE = "#FFFFFF";
const BLACK = "#0B0B0B";
/** Handwritten “clicky” */
const CLICKY_YELLOW = "#FFE94A";
const HEART = "#FF8AB5";

const { width: SCREEN_W } = Dimensions.get("window");
const CONTENT_PAD = 28;
const TEXT_BLOCK_W = SCREEN_W - CONTENT_PAD * 2;

/** Outlined headline row — left-aligned, white stroke, transparent fill */
function OutlineLine({ label, fontSize }: { label: string; fontSize: number }) {
    const height = fontSize * 1.35;
    const fontFamily = Platform.select({
        ios: "HelveticaNeue-BoldItalic",
        android: "sans-serif",
        default: "System",
    });
    return (
        <Svg width={TEXT_BLOCK_W} height={height}>
            <SvgText
                x={0}
                y={fontSize * 1.05}
                textAnchor="start"
                fill="none"
                stroke={WHITE}
                strokeWidth={2.6}
                fontSize={fontSize}
                fontWeight="800"
                fontStyle="italic"
                fontFamily={fontFamily}
            >
                {label}
            </SvgText>
        </Svg>
    );
}

const BUBBLE_SPIN_MS = 10_000;

/** Large “3D” heart bubble — thick black outline, continuous 360° (Y) spin */
function HeartSpeechBubble() {
    const spin = useSharedValue(0);

    useEffect(() => {
        spin.value = withRepeat(
            withTiming(360, { duration: BUBBLE_SPIN_MS, easing: Easing.linear }),
            -1,
            false,
        );
    }, []);

    const spinStyle = useAnimatedStyle(() => ({
        transform: [{ perspective: 900 }, { rotateX: "14deg" }, { rotateY: `${spin.value}deg` }],
    }));

    return (
        <View style={styles.bigBubbleShadow}>
            <Animated.View style={[styles.bigBubbleSpin, spinStyle]}>
                <View style={styles.bigBubbleFace}>
                    <Text
                        style={styles.bigBubbleHeart}
                        accessibilityLabel="Notification with heart"
                    >
                        ♥
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
}

/** Small 2D speech bubble with four horizontal “text” lines — between big bubble and character */
function SmallLinesBubble() {
    return (
        <View style={styles.smallBubble}>
            <View style={styles.smallBubbleLine} />
            <View style={styles.smallBubbleLine} />
            <View style={styles.smallBubbleLine} />
            <View style={styles.smallBubbleLine} />
        </View>
    );
}

function CharacterIllustration() {
    return (
        <View style={styles.characterRoot}>
            <View style={styles.chairBack} />
            <View style={styles.chairSeat} />
            <View style={[styles.chairLeg, { left: 14, bottom: 38 }]} />
            <View style={[styles.chairLeg, { left: 30, bottom: 38 }]} />
            <View style={[styles.chairLeg, { left: 46, bottom: 38 }]} />
            <View style={[styles.chairLeg, { left: 62, bottom: 38 }]} />
            <View style={styles.torso} />
            <View style={styles.shorts} />
            <View style={styles.legL} />
            <View style={styles.legR} />
            <View style={styles.sockL} />
            <View style={styles.sockR} />
            <View style={styles.shoeL} />
            <View style={styles.shoeR} />
            <View style={styles.neck} />
            <View style={styles.head} />
            <View style={styles.bun} />
            <View style={styles.armL} />
            <View style={styles.phone} />
        </View>
    );
}

/**
 * Onboarding marketing screen — layout aligned to design reference.
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
                    <OutlineLine label="DYNAMIC" fontSize={60} />
                    <View style={styles.outlineSpacer} />
                    <OutlineLine label="UNI LIFE" fontSize={60} />
                </View>

                <Text style={styles.withWord}>WITH</Text>

                <View style={styles.clickyRow}>
                    <Text style={styles.clicky}>clicky</Text>
                </View>

                <View style={styles.flexSpacer} />

                <View style={styles.bottomBand}>
                    <View style={styles.mascotsRow}>
                        <HeartSpeechBubble />
                        <SmallLinesBubble />
                    </View>
                    <CharacterIllustration />
                </View>
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
        paddingHorizontal: CONTENT_PAD,
        paddingTop: Platform.select({ ios: 52, android: 44, default: 44 }),
        paddingBottom: 20,
    },
    topCopy: {
        alignSelf: "stretch",
        alignItems: "flex-start",
        marginLeft: 60,
    },
    goFor: {
        color: WHITE,
        fontWeight: "800",
        textAlign: "left",
        fontSize: 60,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        alignSelf: "stretch",
        ...Platform.select({
            ios: { fontFamily: "HelveticaNeue-Bold" },
            android: { fontFamily: "sans-serif" },
            default: {},
        }),
    },
    outlineSpacer: {
        height: 4,
    },
    /** Same style as GO FOR — centered, not italic */
    withWord: {
        marginTop: 20,
        marginLeft: 60,
        color: WHITE,
        fontWeight: "800",
        textAlign: "center",
        alignSelf: "stretch",
        fontSize: 60,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        ...Platform.select({
            ios: { fontFamily: "HelveticaNeue-Bold" },
            android: { fontFamily: "sans-serif" },
            default: {},
        }),
    },
    clickyRow: {
        marginTop: 6,
        alignSelf: "center",
        transform: [{ translateX: 36 }],
    },
    clicky: {
        textAlign: "left",
        fontSize: 68,
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
    bottomBand: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingBottom: 4,
    },
    mascotsRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        gap: 18,
        paddingRight: 8,
        paddingBottom: 4,
    },
    bigBubbleShadow: {
        width: 148,
        height: 148,
        shadowColor: "#000",
        shadowOffset: { width: 8, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 2,
        elevation: 12,
    },
    bigBubbleSpin: {
        width: 148,
        height: 148,
        alignItems: "center",
        justifyContent: "center",
    },
    bigBubbleFace: {
        width: 136,
        height: 136,
        borderRadius: 32,
        backgroundColor: WHITE,
        borderWidth: 5,
        borderColor: BLACK,
        alignItems: "center",
        paddingTop: 18,
    },
    bigBubbleHeart: {
        fontSize: 54,
        color: HEART,
    },
    smallBubble: {
        width: 56,
        height: 52,
        borderRadius: 14,
        backgroundColor: WHITE,
        borderWidth: 2,
        borderColor: BLACK,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: "space-between",
        marginBottom: 18,
    },
    smallBubbleLine: {
        height: 2,
        width: "100%",
        borderRadius: 1,
        backgroundColor: "#C5C5D8",
    },
    characterRoot: {
        width: 200,
        height: 260,
        position: "relative",
    },
    chairBack: {
        position: "absolute",
        bottom: 68,
        left: 8,
        width: 56,
        height: 92,
        borderRadius: 10,
        backgroundColor: "#C5D2E3",
    },
    chairSeat: {
        position: "absolute",
        bottom: 64,
        left: 4,
        width: 88,
        height: 18,
        borderRadius: 8,
        backgroundColor: "#A8BAD2",
    },
    chairLeg: {
        position: "absolute",
        width: 3,
        height: 26,
        backgroundColor: WHITE,
        borderRadius: 1,
    },
    torso: {
        position: "absolute",
        bottom: 96,
        right: 22,
        width: 72,
        height: 64,
        borderRadius: 16,
        backgroundColor: "#E8C547",
    },
    shorts: {
        position: "absolute",
        bottom: 78,
        right: 28,
        width: 64,
        height: 28,
        borderRadius: 8,
        backgroundColor: "#7EB6D9",
    },
    legL: {
        position: "absolute",
        bottom: 44,
        right: 68,
        width: 18,
        height: 40,
        borderRadius: 6,
        backgroundColor: "#FFD6C9",
    },
    legR: {
        position: "absolute",
        bottom: 44,
        right: 36,
        width: 18,
        height: 40,
        borderRadius: 6,
        backgroundColor: "#FFD6C9",
    },
    sockL: {
        position: "absolute",
        bottom: 32,
        right: 68,
        width: 18,
        height: 16,
        backgroundColor: WHITE,
    },
    sockR: {
        position: "absolute",
        bottom: 32,
        right: 36,
        width: 18,
        height: 16,
        backgroundColor: WHITE,
    },
    shoeL: {
        position: "absolute",
        bottom: 22,
        right: 64,
        width: 28,
        height: 14,
        borderRadius: 6,
        backgroundColor: WHITE,
        borderBottomWidth: 4,
        borderBottomColor: CLICKY_YELLOW,
    },
    shoeR: {
        position: "absolute",
        bottom: 22,
        right: 32,
        width: 28,
        height: 14,
        borderRadius: 6,
        backgroundColor: WHITE,
        borderBottomWidth: 4,
        borderBottomColor: CLICKY_YELLOW,
    },
    neck: {
        position: "absolute",
        bottom: 154,
        right: 48,
        width: 22,
        height: 16,
        backgroundColor: "#FFD6C9",
    },
    head: {
        position: "absolute",
        bottom: 164,
        right: 34,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#FFD6C9",
    },
    bun: {
        position: "absolute",
        bottom: 206,
        right: 52,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FF8A34",
    },
    armL: {
        position: "absolute",
        bottom: 118,
        right: 12,
        width: 22,
        height: 48,
        borderRadius: 10,
        backgroundColor: "#E8C547",
        transform: [{ rotate: "-18deg" }],
    },
    phone: {
        position: "absolute",
        bottom: 124,
        right: 4,
        width: 22,
        height: 38,
        borderRadius: 4,
        backgroundColor: "#F2F2F2",
        borderWidth: 2,
        borderColor: "#C8C8D8",
    },
});
