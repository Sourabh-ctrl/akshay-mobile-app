import React from "react";
import {
  View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { lookupString } from "../utils";

function ConfirmModal({ visible, onClose, onConfirm, title, accentColor = "#E53E3E", body, cancelLabel, confirmLabel, t }) {
  const { bgBase, textPrimary, textSecondary, borderColor, cardBgSolid } = t;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, { backgroundColor: bgBase, borderColor }]}>
              <Text style={[styles.sheetTitle, { color: textPrimary }]}>{title}</Text>
              <Text style={[styles.sheetBody, { color: textSecondary }]}>{body}</Text>
              <View style={styles.sheetBtns}>
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.sheetBtn, { backgroundColor: cardBgSolid, borderColor }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sheetBtnText, { color: textPrimary }]}>{cancelLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onConfirm}
                  style={[styles.sheetBtn, styles.sheetBtnDanger]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sheetBtnText, { color: "white" }]}>{confirmLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function Modals({
  t,
  activeOverlays, onClose,
  onDelete, onClearAll,
  shareWinText,
  onNativeShare,
  colorMode,
}) {
  const {
    bgBase, textPrimary, textSecondary, borderColor,
    cardBgSolid,
    accentBase, accentBorder,
    invertText, modalContentGlassBg,
  } = t;

  return (
    <>
      {/* Delete modal */}
      <ConfirmModal
        visible={activeOverlays.delete}
        onClose={() => onClose("delete")}
        onConfirm={onDelete}
        t={t}
        title={`Delete this victory?`}
        body={lookupString("del_body")}
        cancelLabel={lookupString("del_keep")}
        confirmLabel={lookupString("del_remove")}
      />

      {/* Clear all modal */}
      <ConfirmModal
        visible={activeOverlays.clearAll}
        onClose={() => onClose("clearAll")}
        onConfirm={onClearAll}
        t={t}
        title={"Clear everything?"}
        body={lookupString("clr_body")}
        cancelLabel={lookupString("clr_cancel")}
        confirmLabel={lookupString("clr_yes")}
      />

      {/* Share modal */}
      <Modal
        visible={activeOverlays.share}
        transparent
        animationType="slide"
        onRequestClose={() => onClose("share")}
      >
        <TouchableWithoutFeedback onPress={() => onClose("share")}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.shareSheet, { backgroundColor: modalContentGlassBg, borderColor }]}>
                <Text style={[styles.shareTitle, { color: textPrimary }]}>
                  Share your <Text style={{ color: accentBase, fontStyle: "italic" }}>win.</Text>
                </Text>

                <View style={[styles.previewBox, { borderColor, backgroundColor: colorMode === "dark" ? "#08090A" : "#F7F9FC" }]}>
                  <Text style={[styles.sparkle, { color: accentBorder }]}>✦</Text>
                  <Text style={[styles.previewText, { color: textPrimary }]}>
                    {shareWinText || "No victory selected."}
                  </Text>
                  <Text style={[styles.previewBrand, { color: textSecondary }]}>Victory Journal</Text>
                </View>

                <TouchableOpacity onPress={onNativeShare} activeOpacity={0.85}>
                  <View style={[styles.shareBtn, { backgroundColor: accentBase }]}>
                    <Text style={[styles.shareBtnText, { color: colorMode === "dark" ? "#08090A" : "white" }]}>
                      Share via…
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onClose("share")} style={styles.closeBtn} activeOpacity={0.6}>
                  <Text style={[styles.closeBtnText, { color: textSecondary }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center", padding: 20,
  },
  sheet: {
    width: "100%", borderRadius: 32, borderWidth: 1,
    padding: 28, gap: 20,
  },
  sheetTitle: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  sheetBody: { fontSize: 15, fontWeight: "400", lineHeight: 24, opacity: 0.8 },
  sheetBtns: { flexDirection: "row", gap: 12, marginTop: 8 },
  sheetBtn: { flex: 1, paddingVertical: 18, borderRadius: 20, borderWidth: 1, alignItems: "center" },
  sheetBtnDanger: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  sheetBtnText: { fontSize: 15, fontWeight: "700" },
  shareSheet: {
    width: "100%", borderRadius: 36, borderWidth: 1,
    padding: 24, gap: 20,
  },
  shareTitle: { fontSize: 20, fontWeight: "400", textAlign: "center" },
  previewBox: {
    borderWidth: 1, borderRadius: 28,
    padding: 28, gap: 16, alignItems: "center",
    minHeight: 180,
  },
  sparkle: { fontSize: 28 },
  previewText: { fontSize: 19, fontWeight: "400", fontStyle: "italic", textAlign: "center", lineHeight: 28 },
  previewBrand: { fontSize: 11, letterSpacing: 3, fontWeight: "700", textTransform: "uppercase", marginTop: 12 },
  shareBtn: {
    borderRadius: 20, paddingVertical: 20, alignItems: "center",
  },
  shareBtnText: { fontSize: 16, fontWeight: "700" },
  closeBtn: { paddingVertical: 12, alignItems: "center" },
  closeBtnText: { fontSize: 14, fontWeight: "500" },
});
