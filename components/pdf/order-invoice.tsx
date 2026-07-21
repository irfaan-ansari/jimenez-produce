import {
  OrderSelectType,
  LineItemSelectType,
  OrganizationSelectType,
  TeamSelectType,
} from "@/lib/db/schema";
import { format } from "date-fns";
import { styles } from "./styles";
import { formatPhone, formatUSD } from "@/lib/utils";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

interface OrderInvoiceProps {
  data: OrderSelectType & {
    lineItems: LineItemSelectType[];
    organization: OrganizationSelectType;
    team: TeamSelectType;
  };
}

export const OrderInvoice = ({ data }: OrderInvoiceProps) => {
  const metadata = data.organization.metadata
    ? JSON.parse(data.organization.metadata)
    : {};

  return (
    <Document title={`Estimate - ${data.id}`}>
      <Page size="A4" style={[{ padding: 20 }]}>
        <View style={[{ borderWidth: 1, flex: 1 }]}>
          <View
            style={[
              styles.tableRow,
              {
                borderBottomWidth: 1,
                paddingHorizontal: 6,
                paddingVertical: 20,
              },
            ]}
          >
            <View
              style={[
                styles.headerLeft,
                {
                  flex: 1,
                  alignItems: "flex-start",
                },
              ]}
            >
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={[styles.logo]}
              />

              <View style={[styles.headerContactText]}>
                <Text
                  style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}
                >
                  Jimenez Produce
                </Text>
                <Text>{metadata?.street || ""}</Text>
                <Text>{`${metadata?.city || ""}, ${metadata?.state || ""} ${metadata?.zip || ""}`}</Text>
                <Text>Phone: +1 {formatPhone(data.organization?.phone)}</Text>
                <Text>Email: {data.organization?.email}</Text>
              </View>
            </View>

            <View style={[styles.headerRight, { width: "40%" }]}>
              <Text
                style={[styles.docTitle, { fontSize: 24, marginBottom: 10 }]}
              >
                ESTIMATE
              </Text>
            </View>
          </View>

          {/* Invoice details */}
          <View
            style={[
              styles.tableRow,
              { borderBottomWidth: 1, fontSize: 9, lineHeight: 1.5 },
            ]}
          >
            {/* invoice detail */}
            <View
              style={{
                width: "50%",
                padding: 6,
                paddingBottom: 10,
                borderRightWidth: 1,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ fontSize: 10, width: "60%" }}>Invoice #</Text>
                <Text style={{ fontWeight: "bold" }}>{data.id}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ fontSize: 10, width: "60%" }}>Invoice Date</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {format(new Date(data.createdAt!), "MMM dd, yyyy")}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ fontSize: 10, width: "60%" }}>P.O. Number</Text>
                <Text style={{ fontWeight: "bold" }}>{data.po ?? "-"}</Text>
              </View>
            </View>
            {/* delivery prefrence */}
            <View
              style={{
                width: "50%",
                padding: 6,
                paddingBottom: 10,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ fontSize: 10, width: "60%" }}>
                  Delivery Date
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {data.deliveryDate
                    ? format(new Date(data.deliveryDate!), "MMM dd, yyyy")
                    : "-"}
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row", gap: 6 }}>
                <Text style={{ fontSize: 10, width: "60%" }}>
                  Delivery Time
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {data?.deliveryWindow ?? "Anytime"}
                </Text>
              </View>
            </View>
          </View>

          {/* BILLING & SHIPPING SECTION */}
          <View style={[styles.tableRow]}>
            <View
              style={{
                width: "50%",
                borderRightWidth: 1,
              }}
            >
              <Text
                style={[
                  styles.tableColHeader,
                  {
                    borderRightWidth: 0,
                    borderBottomWidth: 1,
                    backgroundColor: "#EEEEEE",
                  },
                ]}
              >
                Bill To
              </Text>

              <View
                style={{
                  padding: 6,
                  paddingBottom: 40,
                }}
              >
                <Text style={{ fontSize: 9 }}>{data.team.name}</Text>
                <Text style={{ fontSize: 9 }}>{data.team.phone}</Text>
                <Text style={{ fontSize: 9 }}>{data.team.email}</Text>
              </View>
            </View>

            <View
              style={{
                width: "50%",
              }}
            >
              <Text
                style={[
                  styles.tableColHeader,
                  {
                    borderRightWidth: 0,
                    borderBottomWidth: 1,
                    backgroundColor: "#EEEEEE",
                  },
                ]}
              >
                Ship To
              </Text>

              <View
                style={{
                  padding: 6,
                  paddingBottom: 40,
                }}
              >
                <Text style={{ fontSize: 9 }}>{data.team.name}</Text>
                <Text style={{ fontSize: 9 }}>{data.team.phone}</Text>
                <Text style={{ fontSize: 9 }}>{data.team.email}</Text>
              </View>
            </View>
          </View>

          {/* LINE ITEMS TABLE */}
          <View style={styles.table}>
            <View
              style={[
                styles.tableRow,
                { backgroundColor: "#EEEEEE", borderBottomWidth: 1 },
              ]}
            >
              <View style={{ width: "15%" }}>
                <Text style={styles.tableColHeader}>Item #</Text>
              </View>
              <View style={{ width: "45%" }}>
                <Text style={styles.tableColHeader}>Description</Text>
              </View>
              <View style={{ width: "10%" }}>
                <Text style={[styles.tableColHeader, { textAlign: "center" }]}>
                  Qty
                </Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text style={[styles.tableColHeader, { textAlign: "right" }]}>
                  Unit Price
                </Text>
              </View>
              <View style={{ width: "15%" }}>
                <Text
                  style={[
                    styles.tableColHeader,
                    { borderRightWidth: 0, textAlign: "right" },
                  ]}
                >
                  Amount
                </Text>
              </View>
            </View>

            {data.lineItems?.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 !== 0 ? { backgroundColor: "#EEEEEE" } : {},
                ]}
              >
                <View style={{ width: "15%" }}>
                  <Text style={styles.tableCellPacking}>{item.identifier}</Text>
                </View>
                <View style={{ width: "45%" }}>
                  <Text style={styles.tableCellPacking}>{item.title}</Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text
                    style={[styles.tableCellPacking, { textAlign: "center" }]}
                  >
                    {item.quantity}
                  </Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text
                    style={[styles.tableCellPacking, { textAlign: "right" }]}
                  >
                    {formatUSD(item.price ?? 0)}
                  </Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text
                    style={[
                      styles.tableCellPacking,
                      { textAlign: "right", borderRightWidth: 0 },
                    ]}
                  >
                    {formatUSD(item.total ?? 0)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: "auto" }}>
            {/* TOTALS SECTION */}
            <View style={[styles.tableRow, { borderTopWidth: 1 }]}>
              <View style={{ flex: 1, borderRightWidth: 1, padding: 6 }}>
                <Text
                  style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}
                >
                  Notes & Instructions:
                </Text>
                {/* <Text style={{ fontSize: 9, color: "#444" }}>
                Please include the invoice number on your check.
              </Text> */}
              </View>

              <View style={{ width: "40%" }}>
                <View
                  style={[
                    styles.tableRow,
                    { padding: 6, borderBottomWidth: 1 },
                  ]}
                >
                  <Text style={{ fontSize: 10, flex: 1 }}>Subtotal</Text>
                  <Text style={{ fontSize: 10 }}>
                    {formatUSD(data.subtotal)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.tableRow,
                    { padding: 6, borderBottomWidth: 1 },
                  ]}
                >
                  <Text style={{ fontSize: 10, flex: 1 }}>Tax</Text>
                  <Text style={{ fontSize: 10 }}>{formatUSD(data.tax)}</Text>
                </View>
                {data.charges && (
                  <View
                    style={[
                      styles.tableRow,
                      { padding: 6, borderBottomWidth: 1 },
                    ]}
                  >
                    <Text style={{ fontSize: 10, flex: 1 }}>
                      {data.charges.type}
                    </Text>
                    <Text style={{ fontSize: 10 }}>
                      {formatUSD(data.charges.amount ?? 0)}
                    </Text>
                  </View>
                )}
                <View style={[styles.tableRow, { padding: 6 }]}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    Total Amount
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: "bold" }}>
                    {formatUSD(data.total)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* FOOTER */}
        </View>
      </Page>
    </Document>
  );
};
