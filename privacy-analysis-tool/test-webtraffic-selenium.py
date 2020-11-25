import dpkt, pcap
pc = pcap.pcap()     # construct pcap object
pc.setfilter('icmp') # filter out unwanted packets
for timestamp, packet in pc:
    print dpkt.ethernet.Ethernet(packet)
